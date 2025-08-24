const express = require("express");
const userController = require("../controllers/userController.js");

const userRouter = express.Router();

// Auth
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);

// Users
userRouter.get("/", userController.getAllUsers); // GET /users
userRouter.get("/:id", userController.getUserProfile); // GET /users/:id
userRouter.put("/:id", userController.updateUserProfile); // PUT /users/:id
userRouter.delete("/:id", userController.deleteUserProfile); // DELETE /users/:id

module.exports = userRouter;
