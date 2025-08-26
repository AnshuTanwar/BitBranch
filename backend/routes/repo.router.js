const express = require('express');
const repoController = require('../controllers/repoController.js');
const { authMiddleware } = require('../middleware/auth.js');

const repoRouter = express.Router();

repoRouter.post('/create', authMiddleware, repoController.createRepository);
repoRouter.get('/all', repoController.getAllRepository);
repoRouter.get('/name/:name', repoController.fetchRepositoryByName);
repoRouter.get('/:id', repoController.fetchRepositoryById);
repoRouter.get('/user/me', authMiddleware, repoController.fetchRepositoryForCurrentUser);
repoRouter.put('/update/:id', authMiddleware, repoController.updateRepositoryById);
repoRouter.delete('/delete/:id', authMiddleware, repoController.deleteRepositoryById);
repoRouter.patch('/toggle/:id', authMiddleware, repoController.toggleVisibilityById);

module.exports = repoRouter;
