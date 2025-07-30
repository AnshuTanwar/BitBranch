const express = require('express');
const userController = require('../controllers/userController.js');

const userRouter = express.Router();

userRouter.get('/allUsers', userController.getAllUsers);