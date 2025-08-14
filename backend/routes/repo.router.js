const express = require('express');
const repoController = require('../controllers/repoController.js');

const repoRouter = express.Router();

repoRouter.post('/repo/create', repoController.createRepository);
repoRouter.get('/repo/all', repoController.getAllRepository);
repoRouter.get('/repo/:id', repoController.fetchRepositoryById);
repoRouter.get('/repo/n/:name', repoController.fetchRepositoryByName);
repoRouter.get('/repo/user/:userId', repoController.fetchRepositoryForCurrentUser);
repoRouter.put('/repo/update/:id', repoController.updateRepositoryById);
repoRouter.delete('/repo/delete/:id', repoController.deleteRepositoryById);
repoRouter.patch('/repo/toggle/:id', repoController.toggleVisibilityById);

module.exports = repoRouter;