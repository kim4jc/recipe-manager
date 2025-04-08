const express = require('express');
const cors = require('cors');
const connectToDB = require('./db.js');
const User = require('./models/user.js');
const Recipe = require('./models/recipes.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
app = express();

dotenv.config();
const BACKEND_PORT = process.env.BACKEND_PORT;
const FRONTEND_API_URL = process.env.FRONTEND_API_URL;
const salt = bcrypt.genSaltSync(10);
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({credentials:true,origin:`${FRONTEND_API_URL}`}));
app.use(express.json());
app.use(cookieParser());

connectToDB();

app.post('/register', async (req,res) => {
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

app.post('/login', async (req, res) => {
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

app.get('/profile', (req, res) => {
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
  
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json("Logged out");
});

app.post('/create', async (req, res) => {
    try{
        console.log(req.body);
        //get recipe info from request
        const {recipeName, cuisine, difficulty, imgFile, ingredients, steps } = req.body;
        //create a userDoc with username and encryped pwd
        const recipeDoc = await Recipe.create({
            recipeName,
            cuisine,
            difficulty,
            imgFile,
            ingredients,
            steps,
        });
        res.json(recipeDoc);
    }
    catch(err){
        res.status(400).json(err);
    }
    });

app.listen(BACKEND_PORT);