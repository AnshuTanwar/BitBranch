const mongoose = require('mongoose');
const { Schema } = mongoose;

const RepositorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    content: [
        {
            type: String,
        },
    ],
    visibility: {
        type: Boolean,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    issues: [
        {
            type: Schema.Types.ObjectId,
            ref: "Issue",
        },
    ],
});

const Repository = mongoose.model("Repository", RepositorySchema);

export default Repository;