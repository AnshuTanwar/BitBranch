const express = require("express");
const repoController = require("../controllers/repoController.js");
const { authMiddleware } = require("../middleware/auth.js");
const validate = require("../middleware/validate.js");
const { createRepoValidator, repoIdParam } = require("../validators/repo.validators.js");

const repoRouter = express.Router();

// Public Routes
repoRouter.get("/all", repoController.getAllRepository);
repoRouter.get("/:id", repoIdParam, validate, repoController.fetchRepositoryById);

// Protected Routes
repoRouter.post("/", authMiddleware, createRepoValidator, validate, repoController.createRepository);
repoRouter.get("/my", authMiddleware, repoController.fetchRepositoryForCurrentUser);
repoRouter.put("/:id", authMiddleware, repoIdParam, validate, repoController.updateRepositoryById);
repoRouter.patch("/:id/visibility", authMiddleware, repoIdParam, validate, repoController.toggleVisibilityById);
repoRouter.delete("/:id", authMiddleware, repoIdParam, validate, repoController.deleteRepositoryById);

// Star/Unstar
repoRouter.post("/:id/star", authMiddleware, repoController.starRepository);
repoRouter.delete("/:id/star", authMiddleware, repoController.unstarRepository);

// Get all starred repos of current user
repoRouter.get("/starred/me", authMiddleware, repoController.getStarredRepositories);


module.exports = repoRouter;
