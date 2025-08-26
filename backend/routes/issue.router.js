const express = require('express');
const issueController = require('../controllers/issueController.js');
const { authMiddleware } = require('../middleware/auth.js');

const issueRouter = express.Router();

// Protected
issueRouter.post('/create/:repoId', authMiddleware, issueController.createIssue);
issueRouter.put('/update/:id', authMiddleware, issueController.updateIssueById);
issueRouter.delete('/delete/:id', authMiddleware, issueController.deleteIssueById);

// Public
issueRouter.get('/repo/:repoId', issueController.getAllIssues);
issueRouter.get('/:id', issueController.getIssueById);

module.exports = issueRouter;
