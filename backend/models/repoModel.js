const mongoose = require("mongoose");
const { Schema } = mongoose;

const repoSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        visibility: { type: Boolean, default: true }, // true = public, false = private
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: [{ type: String }],

        // ⭐ New fields
        stars: { type: Number, default: 0 },
        contributors: [{ type: Schema.Types.ObjectId, ref: "User" }],

        // issues array (already in your current model)
        issues: [{ type: Schema.Types.ObjectId, ref: "Issue" }],
    },
    {
        timestamps: true, // adds createdAt + updatedAt
    }
);

module.exports = mongoose.model("Repository", repoSchema);
