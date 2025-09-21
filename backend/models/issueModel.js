// models/issueModel.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const IssueSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },

        status: {
            type: String,
            enum: ["open", "in-progress", "closed"],
            default: "open",
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },

        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        assignee: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        labels: [{ type: String }],

        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],

        // keep same field name used elsewhere: "repository"
        repository: {
            type: Schema.Types.ObjectId,
            ref: "Repository",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Issue", IssueSchema);
