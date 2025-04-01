const express = require('express');
const cors = require('cors');
const connectToDB = require('./db.js');
const User = require('./models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
app = express();

dotenv.config({ path: '../.env' });
const BACKEND_PORT = process.env.BACKEND_PORT;
const FRONTEND_PORT = process.env.FRONTEND_PORT;
const salt = bcrypt.genSaltSync(10);
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({credentials:true,origin:`http://localhost:${FRONTEND_PORT}`}));
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

app.get('/profile', (req, res) => {
    console.log("/profile called");
    if(!req.cookies){
        return;
    }
    const {token} = req.cookies;
    if(!token){
        return;
    }
    jwt.verify(token, JWT_SECRET, {}, (err, info) => {
        if(err) throw err;
        console.log("before jwt payload return");
        res.json(info);
    });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json("Logged out");
});


app.listen(BACKEND_PORT);