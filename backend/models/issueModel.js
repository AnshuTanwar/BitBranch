const mongoose = require('mongoose');
const { Schema } = mongoose;

const IssueSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        enum: ["open", "closed"],
        default: "open",
    },
    repository: {
        type: Schema.Types.ObjectId,
        ref: "Repository",
        required: true,
    },
});

const Issue = mongoose.model("Issue", IssueSchema);

export default Issue;
