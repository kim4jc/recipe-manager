const express = require('express');
const cors = require('cors');
const connectToDB = require('./db.js');
const User = require('./models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
app = express();

const salt = bcrypt.genSaltSync(10);
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());

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
            res.cookie('token', token).json('Successful Login');
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

app.listen(4000);