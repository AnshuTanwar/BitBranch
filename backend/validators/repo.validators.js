const { body, param } = require("express-validator");

const createRepoValidator = [
    body("name").trim().notEmpty().withMessage("name required"),
    body("visibility").optional().isBoolean().withMessage("visibility boolean"),
    body("description").optional().isString(),
];

const repoIdParam = [ param("id").isMongoId().withMessage("invalid repo id") ];

module.exports = { createRepoValidator, repoIdParam };
