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

module.exports = repoRouter;
