const express = require("express");
const repoController = require("../controllers/repoController.js");
const { authMiddleware } = require("../middleware/auth.js");
const validate = require("../middleware/validate.js");
const { createRepoValidator, repoIdParam } = require("../validators/repo.validators.js");

const repoRouter = express.Router();

// Public Routes
repoRouter.get("/all", repoController.getAllRepository);

// Protected Routes - IMPORTANT: Specific routes MUST come before parameterized routes
repoRouter.post("/", authMiddleware, createRepoValidator, validate, repoController.createRepository);
repoRouter.get("/my", authMiddleware, repoController.fetchRepositoryForCurrentUser);
repoRouter.get("/starred/me", authMiddleware, repoController.getStarredRepositories);

// Star/Unstar routes - Must come before /:id routes
repoRouter.post("/:id/star", authMiddleware, repoController.starRepository);
repoRouter.delete("/:id/star", authMiddleware, repoController.unstarRepository);

// Parameterized routes - MUST come last to avoid conflicts
repoRouter.get("/:id", repoController.fetchRepositoryById); // Temporarily removed validation
repoRouter.put("/:id", authMiddleware, repoIdParam, validate, repoController.updateRepositoryById);
repoRouter.patch("/:id/visibility", authMiddleware, repoIdParam, validate, repoController.toggleVisibilityById);
repoRouter.delete("/:id", authMiddleware, repoIdParam, validate, repoController.deleteRepositoryById);


module.exports = repoRouter;
