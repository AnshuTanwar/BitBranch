// routes/issue.router.js
const express = require("express");
const issueController = require("../controllers/issueController.js");
const { authMiddleware } = require("../middleware/auth.js");
const validate = require("../middleware/validate.js");
const {
    createIssueValidator,
    updateIssueValidator,
    statusValidator,
    assignValidator,
    commentValidator,
    issueIdParam,
    repoIdParam,
} = require("../validators/issue.validators.js");

const issueRouter = express.Router();

// Protected
issueRouter.post(
    "/create/:repoId",
    authMiddleware,
    createIssueValidator,
    validate,
    issueController.createIssue
);

issueRouter.put(
    "/update/:id",
    authMiddleware,
    updateIssueValidator,
    validate,
    issueController.updateIssueById
);

issueRouter.delete(
    "/delete/:id",
    authMiddleware,
    issueIdParam,
    validate,
    issueController.deleteIssueById
);

// New endpoints
issueRouter.put("/:id/status", authMiddleware, statusValidator, validate, issueController.updateIssueStatus);
issueRouter.put("/:id/assign", authMiddleware, assignValidator, validate, issueController.assignIssue);
issueRouter.post("/:id/comments", authMiddleware, commentValidator, validate, issueController.addComment);

// Public
issueRouter.get("/repo/:repoId", repoIdParam, validate, issueController.getAllIssues);
issueRouter.get("/:id", issueIdParam, validate, issueController.getIssueById);
issueRouter.get("/:id/comments", issueIdParam, validate, issueController.getComments);

module.exports = issueRouter;
