const express = require('express');
const issueController = require('../controllers/issueController.js');

const issueRouter = express.Router();

issueRouter.post('/issue/create', issueController.createIssue);
issueRouter.put('/issue/update/:id', issueController.updateIssueById);
issueRouter.get('/issue/delete/:id', issueController.deleteIssueById);
issueRouter.get('/issue/all', issueController.getAllIssues);
issueRouter.get('/issue/:id', issueController.getIssueById);

module.exports = issueRouter;