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
const signup = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;

    // Check existing user
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) throw new AppError("User already exists", 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({ token, userId: newUser._id });
});

/**
 * @desc   User login
 * @route  POST /auth/login
 */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new AppError("User not found", 400);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError("Invalid credentials", 400);

    const token = generateToken(user._id);

    res.json({ token, userId: user._id });
});

/**
 * @desc   Get current user (from token)
 * @route  GET /users/me
 */
const getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user; // From auth middleware
    const user = await User.findById(userId)
        .select("-password")
        .populate("followers", "username email")
        .populate("following", "username email")
        .populate("starredRepos", "name description");
    if (!user) throw new AppError("User not found", 404);
    res.json(user);
});

/**
 * @desc   Get user profile
 * @route  GET /users/:id
 */
const getUserProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) throw new AppError("User not found", 404);
    res.json(user);
});

/**
 * @desc   Update user profile
 * @route  PUT /users/:id
 */
const updateUserProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { email, password } = req.body;

    const updateFields = {};
    if (email) updateFields.email = email;
    if (password) updateFields.password = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true }
    ).select("-password");

    if (!updatedUser) throw new AppError("User not found", 404);

    res.json(updatedUser);
});

/**
 * @desc   Delete user profile
 * @route  DELETE /users/:id
 */
const deleteUserProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) throw new AppError("User not found", 404);
    res.json({ message: "User Profile Deleted" });
});

module.exports = {
    getAllUsers,
    signup,
    login,
    getCurrentUser,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
};
