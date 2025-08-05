const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient, ReturnDocument } = require('mongodb');
const dotenv = require('dotenv');
const ObjectId = require('mongodb').ObjectId;

dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
    if(!client) {
        client = new MongoClient(uri);

        await client.connect();
    }
}

async function getAllUsers(req, res) {
    try {
        await connectClient();
        const db = client.db("bitbranch");
        const usersCollection = db.collection("users");

        const users = await usersCollection.find({}).toArray();
        res.json(users);
    } catch(err) {
        console.error("Error getting users: ", err.message);
        res.status(500).send("server error");
    }
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

async function login(req, res) {
    const {email, password} = req.body;

    try {
        await connectClient();
        const db = client.db("bitbranch");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({email});

        if(!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY);
        res.json({token, userId:user._id});
    } catch(err) {
        console.error("Error during login : ", err.message);
        res.status(500).send("Server Error");
    }
};


async function getUserProfile(req, res) {
    const currentId = req.params.id;

    try{
        await connectClient();
        const db = client.db("bitbranch");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({
            _id: new ObjectId(currentId)
        });

        if(!user) {
            return res.status(400).json({ message: "User not found" });
        }

        res.send(user);
    } catch(err) {
        console.error("Error during login : ", err.message);
        res.status(500).send("Server Error");
    }
};

async function updateUserProfile(req, res) {
    const currentId = req.params.id;
    const { email, password } = req.body;

    try {
        await connectClient();
        const db = client.db("bitbranch");
        const usersCollection = db.collection("users");

        if (!ObjectId.isValid(currentId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        let updateFields = {};
        if (email) updateFields.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }

        // Step 1: Update
        const updateResult = await usersCollection.updateOne(
            { _id: new ObjectId(currentId) },
            { $set: updateFields }
        );

        if (updateResult.matchedCount === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        // Step 2: Return updated user
        const updatedUser = await usersCollection.findOne({ _id: new ObjectId(currentId) });
        res.json(updatedUser);

    } catch (err) {
        console.error("Error updating profile : ", err.message);
        res.status(500).send("Server Error");
    }
}


async function deleteUserProfile(req, res) {
    const currentId = req.params.id;

    try{
        await connectClient();
        const db = client.db("bitbranch");
        const usersCollection = db.collection("users");

        const result = await usersCollection.deleteOne({
            _id: new ObjectId(currentId),
        });

        if(result.deletedCount == 0) {
            return res.status(400).json({ message: "No user deleted" });
        }

        res.json({message: "User Profile Deleted."});

    } catch {
        console.error("Error deleting profile : ", err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
}