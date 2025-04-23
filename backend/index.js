const express = require('express');
const cors = require('cors');
const connectToDB = require('./db.js');
const User = require('./models/user.js');
const Recipe = require('./models/recipes.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const multer = require('multer');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

dotenv.config();
app = express();

const BACKEND_PORT = process.env.BACKEND_PORT;
const FRONTEND_API_URL = process.env.FRONTEND_API_URL;
const salt = bcrypt.genSaltSync(10);
const JWT_SECRET = process.env.JWT_SECRET;


app.use(cors({credentials:true,origin:`${FRONTEND_API_URL}`}));
app.use(express.json());
app.use(cookieParser());

connectToDB();

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    }
});

async function getPreSignedUrl(fileKey) {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
    });

    return await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL expires in 1 hour
}

const upload = multer({ storage: multer.memoryStorage() });

async function uploadFileToS3(fileBuffer, fileName, fileType) {
    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
        ContentType: fileType,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    // Construct the public S3 file URL
    return fileName;
}

app.post('/api/register', async (req,res) => {
    try{
        //get username and password from request
        const {username, password} = req.body;
        //create a userDoc with username and encryped pwd
        const userDoc = await User.create({
            username, 
            password:bcrypt.hashSync(password, salt),
        });
        //return userDoc to show it works (will remove later)
        res.json(userDoc);
    }
    catch(err){
        res.status(400).json(err);
    }
});

app.post('/api/login', async (req, res) => {
    try{
        
        const {username, password} = req.body;
        const userDoc = await User.findOne({username});
        if(!userDoc) res.status(400).json("Incorrect username or password");
        const correctPwd = bcrypt.compareSync(password, userDoc.password);
        if(correctPwd){
        //logged in and respond w/ jwt
        const payload = {
            user: {
                username,
                id: userDoc._id,
            },
        }
        jwt.sign(payload, JWT_SECRET, {}, (err, token) => {
            if(err) throw err;
            //store JWT in cookies
            res.cookie('token', token).json({ user: {username: username, id: userDoc._id}, message: "Successful login" });
        });
        }
        else{
            res.status(400).json("Incorrect username or password");
        }
    }
    catch(err){
        res.status(400).json(err);
    }
})

app.get('/api/profile', (req, res) => {
    // Get JWT token from cookies
    const { token } = req.cookies;
    //return if no token found
    if (!token) {
      console.log("No token found");
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    //verify token with secret
    jwt.verify(token, JWT_SECRET, {}, (err, info) => {
      if (err) {
        console.error("JWT verification error:", err);
        res.status(401).json({ message: "Invalid token" });
        return;
      }
      res.json(info);
    });
  });
  
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json("Logged out");
});

app.post('/api/create', upload.single('imgFile'), async (req, res) => {
    try{
        // Get JWT token from cookies
        const { token } = req.cookies;
        //return if no token found
        if (!token) {
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }
        //verify token with secret
        jwt.verify(token, JWT_SECRET, {}, async (err, info) => {
            if (err) {
                res.status(401).json({ message: "Invalid token" });
                return;
            }
            console.log(info);
            console.log(req.body);
            
             // Default to no image
            let imgKey = null;
            //if there is an img then upload it to S3 and get imgkey to store in mongodb
            if (req.file) {
                const fileName = `${randomImageName()}`;
                imgKey = await uploadFileToS3(req.file.buffer, fileName, req.file.mimetype);
            }

            //get recipe info from request
            const {recipeName, cuisine, difficulty, ingredients, steps } = req.body;

            const parsedIngredients = Array.isArray(ingredients) ? ingredients : JSON.parse(ingredients);
            const parsedSteps = Array.isArray(steps) ? steps : JSON.parse(steps);
                        
            //create a recipeDoc with recipe data
            const recipeDoc = await Recipe.create({
                userID: info.user.id,
                recipeName,
                cuisine,
                difficulty,
                imgFile: imgKey,
                ingredients: parsedIngredients,
                steps: parsedSteps,
            });
        res.json(recipeDoc);
        });
    }
    catch(err){
        res.status(400).json(err);
    }
    });

app.get('/api/fetch', async(req, res) => {
    try{
        // Get JWT token from cookies
        const { token } = req.cookies;
        //return if no token found
        if (!token) {
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }
        //verify token with secret
        jwt.verify(token, JWT_SECRET, {}, async(err, info) => {
            if (err) {
                res.status(401).json({ message: "Invalid token" });
                return;
            }
            //find and return all recipes created by the userid that matches the userid in cookies
            const userRecipes = await Recipe.find({ userID: info.user.id });

            for(recipe of userRecipes){
                if(recipe.imgFile)
                    recipe.imgFile = await getPreSignedUrl(recipe.imgFile);
            }

            res.status(200).json(userRecipes);
        });
    }
    catch(err){
        res.status(500).json(err);
    }
})

app.get('/api/fetch/:recipeId', async (req, res) => {
    try{
        // Get JWT token from cookies
        const { token } = req.cookies;
        const id = req.params.recipeId;
        //return if no token found
        if (!token) {
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }
        //verify token with secret
        jwt.verify(token, JWT_SECRET, {}, async(err, info) => {
            if (err) {
                res.status(401).json({ message: "Invalid token" });
                return;
            }
            //find and return one recipe with matching recipeId
            const userRecipe = await Recipe.findById(id);
            if (userRecipe && userRecipe.imgFile) {
                userRecipe.imgFile = await getPreSignedUrl(userRecipe.imgFile);
            }
            //return if userId from cookies doesnt match recipe userId
            if (info.user.id !== userRecipe.userID.toString()) {
                res.status(403).json({ message: "You do not have permission to view this recipe" });
                return;
            }
            res.status(200).json(userRecipe);
        });
        }
    catch(err){
        res.status(500).json(err);
        }
})

app.put(`/api/update/:recipeId`, upload.single('imgFile'), async(req, res) => {
    try{
        // Get JWT token from cookies
        const { token } = req.cookies;
        const id = req.params.recipeId;
        //return if no token found
        if (!token) {
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }
        //verify token with secret
        jwt.verify(token, JWT_SECRET, {}, async(err, info) => {
            if (err) {
                res.status(401).json({ message: "Invalid token" });
                return;
            }

            //get imgKey from existing recipe
            const existingRecipe = await Recipe.findById(id);
            //return if userId from cookies doesnt match recipe userId
            if (info.user.id !== existingRecipe.userID.toString()) {
                res.status(403).json({ message: "You do not have permission to update this recipe" });
                return;
            }
            let imgKey = existingRecipe.imgFile;
            console.log("imgKey:", imgKey);

            //if image is uploaded overwrite the old img with new img using same imgkey
            if(req.file){
                if(!imgKey){
                imgKey = `${randomImageName()}`;
                }
                await uploadFileToS3(req.file.buffer, imgKey, req.file.mimetype);
            }


            //get updated recipe data from request
            const {recipeName, cuisine, difficulty, ingredients, steps } = req.body;

            const parsedIngredients = Array.isArray(ingredients) ? ingredients : JSON.parse(ingredients);
            const parsedSteps = Array.isArray(steps) ? steps : JSON.parse(steps);

            //find the recipe with matching recipeId and update the old data with new data
            const updatedRecipe = await Recipe.updateOne(
                { _id: id },
                {
                    $set:
                        {
                        recipeName: recipeName,
                        cuisine: cuisine,
                        difficulty: difficulty,
                        imgFile: imgKey,
                        ingredients: parsedIngredients,
                        steps: parsedSteps
                        }
                }
            );
            res.status(200).json({message: "Recipe updated", updatedRecipe});
        });
        }
    catch(err){
        res.status(500).json(err);
        }
})

app.delete(`/api/delete/:recipeId`, async(req, res) => {
    try{
        // Get JWT token from cookies
        const { token } = req.cookies;
        const id = req.params.recipeId;
        //return if no token found
        if (!token) {
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }
        //verify token with secret
        jwt.verify(token, JWT_SECRET, {}, async(err, info) => {
            if (err) {
                res.status(401).json({ message: "Invalid token" });
                return;
            }

            const existingRecipe = await Recipe.findById(id);
            //return if userId from cookies doesnt match recipe userId
            if (info.user.id !== existingRecipe.userID.toString()) {
                res.status(403).json({ message: "You do not have permission to delete this recipe" });
                return;
            }
            if(existingRecipe.imgFile){
                const input = { // DeleteObjectRequest
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: existingRecipe.imgFile,
                }
                const command = new DeleteObjectCommand(input);
                const response = await s3.send(command);
                console.log(response);
            }

            //find the recipe with matching recipeId and delete the document
            const deletedRecipe = await Recipe.deleteOne(
                { _id: id },
            );
            res.status(200).json({message: "Recipe deleted", deletedRecipe});
        });
        }
    catch(err){
        res.status(500).json(err);
        }
})

app.post('/api/search', async (req, res) => {
    try{
        // Get JWT token from cookies
        const { token } = req.cookies;
        //return if no token found
        if (!token) {
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }
        //verify token with secret
        jwt.verify(token, JWT_SECRET, {}, async(err, info) => {
            if (err) {
                res.status(401).json({ message: "Invalid token" });
                return;
            }
            
            const { cuisine, difficulty, ingredients } = req.body;
            const query = {
                ...({ userID: info.user.id }),
                //add cuisine to query if it exists and look for case-insensitive matches
                ...(cuisine && { cuisine: { $regex: cuisine, $options: 'i' } } ),
                //add difficulty to query if it is greater than 0 (not all difficulties) and check for matching difficulty
                ...(difficulty > 0 && { difficulty: Number(difficulty) }),
                //add ingredients to query if it exists and there is an ingredient and check for at least 1 ingredient match
                ...(ingredients && ingredients.length > 0 && { ingredients: { $elemMatch: { $regex: new RegExp(ingredients.join('|'), 'i') } } })
            }
          
            //generate presignedurl to view img if it exists
            const recipes = await Recipe.find(query);
            for(recipe of recipes){
                if(recipe.imgFile)
                    recipe.imgFile = await getPreSignedUrl(recipe.imgFile);
            }

            //split recipes into 2 categories
            const allOrFewerIngredientsUsed = [];
            const atLeastOneMatchingIngredient = [];

            recipes.forEach((recipe) => {
                // Check if all recipe ingredients are present in the recipe
                const isSubset = recipe.ingredients.every((ingredient) => ingredients.includes(ingredient));
                if (isSubset) {
                    allOrFewerIngredientsUsed.push(recipe);
                } else {
                    atLeastOneMatchingIngredient.push(recipe);
                }
            });
            console.log("allOrFewerIngredientsUsed", allOrFewerIngredientsUsed);
            console.log("atLeastOneMatchingIngredient", atLeastOneMatchingIngredient);
            res.status(200).json( {allOrFewerIngredientsUsed, atLeastOneMatchingIngredient });
        })
    }
    catch(err){
        console.log("Error querying: ", err);
    }
})

app.listen(BACKEND_PORT);