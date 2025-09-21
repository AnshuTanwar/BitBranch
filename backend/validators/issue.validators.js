const { body, param } = require("express-validator");

const createIssueValidator = [
    param("repoId").isMongoId().withMessage("invalid repo id"),
    body("title").trim().notEmpty().withMessage("title required"),
    body("description").optional().isString(),
    body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("priority must be low|medium|high"),
    body("labels").optional().isArray().withMessage("labels must be an array"),
];

const updateIssueValidator = [
    param("id").isMongoId().withMessage("invalid issue id"),
    body("title").optional().notEmpty(),
    body("description").optional().isString(),
    body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("priority must be low|medium|high"),
    body("labels").optional().isArray(),
];

const statusValidator = [
    param("id").isMongoId().withMessage("invalid issue id"),
    body("status")
    .isIn(["open", "in-progress", "closed"])
    .withMessage("status must be open|in-progress|closed"),
];

const assignValidator = [
    param("id").isMongoId().withMessage("invalid issue id"),
    body("userId").isMongoId().withMessage("invalid user id"),
];

const commentValidator = [
    param("id").isMongoId().withMessage("invalid issue id"),
    body("content").trim().notEmpty().withMessage("content required"),
];

const issueIdParam = [param("id").isMongoId().withMessage("invalid issue id")];
const repoIdParam = [param("repoId").isMongoId().withMessage("invalid repo id")];

module.exports = {
    createIssueValidator,
    updateIssueValidator,
    statusValidator,
    assignValidator,
    commentValidator,
    issueIdParam,
    repoIdParam,
};
