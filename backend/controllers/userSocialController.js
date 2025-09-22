const User = require("../models/userModel.js");
const Repository = require("../models/repoModel.js");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Follow a user
const followUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const currentUserId = req.user;

    if (id === currentUserId) throw new AppError("You cannot follow yourself", 400);

    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow) throw new AppError("User not found", 404);

    if (currentUser.following.includes(id)) {
        throw new AppError("Already following this user", 400);
    }

    currentUser.following.push(id);
    userToFollow.followers.push(currentUserId);

    await currentUser.save();
    await userToFollow.save();

    res.json({ message: `You are now following ${userToFollow.username}` });
});

// Unfollow a user
const unfollowUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const currentUserId = req.user;

    const userToUnfollow = await User.findById(id);
    if (!userToUnfollow) throw new AppError("User not found", 404);

    await User.findByIdAndUpdate(currentUserId, { $pull: { following: id } });
    await User.findByIdAndUpdate(id, { $pull: { followers: currentUserId } });

    res.json({ message: `Unfollowed ${userToUnfollow.username}` });
});

// Get followers of a user
const getFollowers = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("followers", "username email");
    if (!user) throw new AppError("User not found", 404);

    res.json({ followers: user.followers });
});

// Get following of a user
const getFollowing = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("following", "username email");
    if (!user) throw new AppError("User not found", 404);

    res.json({ following: user.following });
});

// Check if current user is following a specific user
const isFollowing = asyncHandler(async (req, res) => {
    const { id } = req.params; // user to check
    const currentUserId = req.user; // current logged-in user

    if (!currentUserId) {
        return res.json({ isFollowing: false });
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
        return res.json({ isFollowing: false });
    }

    const isFollowingUser = currentUser.following.includes(id);
    res.json({ isFollowing: isFollowingUser });
});

// Star a repository
const starRepo = asyncHandler(async (req, res) => {
    const { id } = req.params; // repo id
    const currentUserId = req.user;

    const repo = await Repository.findById(id);
    if (!repo) throw new AppError("Repository not found", 404);

    const user = await User.findById(currentUserId);

    if (user.starredRepos.includes(id)) {
        throw new AppError("Already starred this repository", 400);
    }

    user.starredRepos.push(id);
    await user.save();

    res.json({ message: `Starred ${repo.name}` });
});

// Unstar a repository
const unstarRepo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const currentUserId = req.user;

    const repo = await Repository.findById(id);
    if (!repo) throw new AppError("Repository not found", 404);

    await User.findByIdAndUpdate(currentUserId, { $pull: { starredRepos: id } });

    res.json({ message: `Unstarred ${repo.name}` });
});

// Get all starred repos for logged-in user
const getStarredRepos = asyncHandler(async (req, res) => {
    const currentUserId = req.user;
    const user = await User.findById(currentUserId).populate("starredRepos");

    res.json({ starredRepos: user.starredRepos });
});

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    isFollowing,
    starRepo,
    unstarRepo,
    getStarredRepos,
};
