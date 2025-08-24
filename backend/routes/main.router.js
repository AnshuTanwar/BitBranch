const express = require("express");
const userController = require("../controllers/userController.js");
const authMiddleware = require("../middleware/auth.js");

const userRouter = express.Router();

// Public Routes
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);

// Protected Routes
userRouter.get("/", authMiddleware, userController.getAllUsers);
userRouter.get("/:id", authMiddleware, userController.getUserProfile);
userRouter.put("/:id", authMiddleware, userController.updateUserProfile);
userRouter.delete("/:id", authMiddleware, userController.deleteUserProfile);

module.exports = userRouter;
