const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema(
    {
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        issue: { type: Schema.Types.ObjectId, ref: "Issue", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
