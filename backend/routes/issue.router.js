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
issueRouter.put("/:id/comments/:commentId", authMiddleware, commentValidator, validate, issueController.updateComment);
issueRouter.delete("/:id/comments/:commentId", authMiddleware, issueController.deleteComment);
issueRouter.patch("/:id/close", authMiddleware, issueIdParam, validate, issueController.closeIssue);
issueRouter.patch("/:id/reopen", authMiddleware, issueIdParam, validate, issueController.reopenIssue);

// Public
issueRouter.get("/", issueController.getAllIssuesGlobal);
issueRouter.get("/repo/:repoId", issueController.getAllIssues); // Temporarily removed validation
issueRouter.get("/:id", issueController.getIssueById); // Temporarily removed validation
issueRouter.get("/:id/comments", issueController.getComments); // Temporarily removed validation

module.exports = issueRouter;
