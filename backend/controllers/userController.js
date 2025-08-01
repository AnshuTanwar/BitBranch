const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
    if(!client) {
        client = new MongoClient(uri);

        await client.connect();
    }
}

const getAllUsers = (req, res) => {
    res.send("All user fetched");
};

async function signup (req, res) {
    const { username, password, email } = req.body;
    try{
        await connectClient();
        const db = client.db("bitbranch");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({username});

        if(user) {
            return res.status(400).json({message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUsers: [],
            starRepo: [],
        }

        const result = await usersCollection.insertOne(newUser);

        const token = jwt.sign({id: result.insertId}, process.env.JWT_SECRET_KEY, { expiresIn: '1h'});
        res.json({token});
    } catch(err) {
        console.error("Error during signup : ", err.message);
        res.status(500).send("server error");
    }
};

const login = (req, res) => {
    res.send("All user fetched");
};

const getUserProfile = (req, res) => {
    res.send("All user fetched");
};

const updateUserProfile = (req, res) => {
    res.send("All user fetched");
};

const deleteUserProfile = (req, res) => {
    res.send("All user fetched");
};

module.exports = {
    getAllUsers,
    signup,
    login,
    getAllUsers,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
}