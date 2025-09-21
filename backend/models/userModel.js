const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    repositories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Repository" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    starredRepos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Repository" }],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
