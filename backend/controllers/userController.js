const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/userModel.js");
const { generateToken } = require("../middleware/auth.js");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

dotenv.config();

/**
 * @desc   Get all users
 * @route  GET /users
 */
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
});

/**
 * @desc   User signup
 * @route  POST /auth/signup
 */
async function signup(req, res) {
    const { username, password, email } = req.body;
    try {
        // Check existing user
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const result = await newUser.save();

        const token = generateToken(result._id);

        res.json({ token, userId: result._id });
    } catch (err) {
        console.error("Error during signup: ", err.message);
        res.status(500).send("Server error");
    }
}

/**
 * @desc   User login
 * @route  POST /auth/login
 */
async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(result._id);

        res.json({ token, userId: user._id });
    } catch (err) {
        console.error("Error during login: ", err.message);
        res.status(500).send("Server error");
    }
}

/**
 * @desc   Get user profile
 * @route  GET /users/:id
 */
async function getUserProfile(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("Error fetching profile: ", err.message);
        res.status(500).send("Server error");
    }
}

/**
 * @desc   Update user profile
 * @route  PUT /users/:id
 */
async function updateUserProfile(req, res) {
    const { id } = req.params;
    const { email, password } = req.body;

    try {
        const updateFields = {};
        if (email) updateFields.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error("Error updating profile: ", err.message);
        res.status(500).send("Server error");
    }
}

/**
 * @desc   Delete user profile
 * @route  DELETE /users/:id
 */
async function deleteUserProfile(req, res) {
    const { id } = req.params;

    try {
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User Profile Deleted" });
    } catch (err) {
        console.error("Error deleting profile: ", err.message);
        res.status(500).send("Server error");
    }
}

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
};
