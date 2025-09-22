const express = require("express");
const userController = require("../controllers/userController.js");
const { authMiddleware } = require("../middleware/auth.js");
const validate = require("../middleware/validate.js");
const {
    signupValidator,
    loginValidator,
    userIdParam,
} = require("../validators/user.validators.js");

const userRouter = express.Router();

// Public
userRouter.post("/signup", signupValidator, validate, userController.signup);
userRouter.post("/login",  loginValidator,  validate, userController.login);

// Protected
userRouter.get("/", authMiddleware, userController.getAllUsers);
userRouter.get("/me", authMiddleware, userController.getCurrentUser);
userRouter.get("/:id", authMiddleware, userIdParam, validate, userController.getUserProfile);
userRouter.put("/:id", authMiddleware, userIdParam, validate, userController.updateUserProfile);
userRouter.delete("/:id", authMiddleware, userIdParam, validate, userController.deleteUserProfile);

module.exports = userRouter;
