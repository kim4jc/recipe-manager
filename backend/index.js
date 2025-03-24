const express = require('express');
const cors = require('cors');
const connectToDB = require('./db.js');
const User = require('./models/user.js');
const bcrypt = require('bcrypt');
const 
app = express();

const salt = bcrypt.genSaltSync(10);

app.use(cors());
app.use(express.json());


app.post('/register', async (req,res) => {
    try{
        //get username and password from request
        const {username, password} = req.body;
        connectToDB();
        const userDoc = await User.create({
            username, 
            password:bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    }
    catch(err){
        res.status(400).json(err);
    }
});

app.listen(4000);