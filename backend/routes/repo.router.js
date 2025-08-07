const express = require('express');
const repoController = require('../controllers/repoController.js');

const repoRouter = express.Router();

repoRouter.post('/repo/create', repoController.createRepository);
repoRouter.get('/repo/all', repoController.getAllRepository);
repoRouter.get('/repo/name/:id', repoController.fetchRepositoryById);
repoRouter.get('/repo/user/:name', repoController.fetchRepositoryByName);
repoRouter.get('/repo/update/:userId', repoController.fetchRepositoryForCurrentUser);
repoRouter.put('/repo/update/:id', repoController.updateRepositoryById);
repoRouter.delete('/repo/delete/:id', repoController.deleteRepositoryById);
repoRouter.patch('/repo/toggle/:id', repoController.toggleVisibiityById);

module.exports = repoRouter;