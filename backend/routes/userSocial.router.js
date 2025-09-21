const express = require("express");
const { authMiddleware } = require("../middleware/auth.js");
const socialController = require("../controllers/userSocialController.js");

const socialRouter = express.Router();

socialRouter.post("/:id/follow", authMiddleware, socialController.followUser);
socialRouter.delete("/:id/follow", authMiddleware, socialController.unfollowUser);

// Followers / Following
socialRouter.get("/:id/followers", socialController.getFollowers);
socialRouter.get("/:id/following", socialController.getFollowing);

// Repo Stars
socialRouter.post("/repos/:id/star", authMiddleware, socialController.starRepo);
socialRouter.delete("/repos/:id/star", authMiddleware, socialController.unstarRepo);
socialRouter.get("/me/starred", authMiddleware, socialController.getStarredRepos);

module.exports = socialRouter;
