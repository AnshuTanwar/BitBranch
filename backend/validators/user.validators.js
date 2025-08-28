const { body, param } = require("express-validator");

const signupValidator = [
    body("username").trim().isLength({ min: 3 }).withMessage("min 3 chars"),
    body("email").isEmail().withMessage("valid email required"),
    body("password").isLength({ min: 6 }).withMessage("min 6 chars"),
];

const loginValidator = [
    body("email").isEmail().withMessage("valid email required"),
    body("password").notEmpty().withMessage("password required"),
];

const userIdParam = [
    param("id").isMongoId().withMessage("invalid user id"),
];

module.exports = { signupValidator, loginValidator, userIdParam };
