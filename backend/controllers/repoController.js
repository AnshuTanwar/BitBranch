const mongoose = require("mongoose");
const Repository = require("../models/repoModel.js");
const User = require("../models/userModel.js");
const Issue = require("../models/issueModel.js");

/**
 * @desc Create a new repository
 * @route POST /repos
 * @access Private
 */
async function createRepository(req, res) {
    const { name, content, description, visibility } = req.body;
    const owner = req.user;

    try {
        if (!name) {
            return res.status(400).json({ error: "Repository name is required" });
        }

        // Check if repo name already exists for this user (or globally)
        const existingRepo = await Repository.findOne({ name, owner });
        if (existingRepo) {
            return res.status(400).json({ error: "Repository name already exists" });
        }

        const newRepository = new Repository({
            name,
            description,
            visibility,
            owner,
            content: content || [],
            issues: [],
        });

        const result = await newRepository.save();

        // Also push repo to user's repositories
        await User.findByIdAndUpdate(owner, { $push: { repositories: result._id } });

        res.status(201).json({
            message: "Repository Created!",
            repositoryID: result._id,
        });
    } catch (err) {
        console.error("Error creating repository: ", err.message);
        res.status(500).send("Server Error");
    }
}

/**
 * @desc Get all repositories
 * @route GET /repos
 * @access Public
 */
async function getAllRepository(req, res) {
    try {
        const repositories = await Repository.find({})
            .populate("owner", "username email")
            .populate("issues");
        res.json(repositories);
    } catch (err) {
        console.error("Error fetching repositories: ", err.message);
        res.status(500).send("Server Error");
    }
}

/**
 * @desc Get repository by ID
 * @route GET /repos/:id
 * @access Public
 */
async function fetchRepositoryById(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid repository ID" });
    }

    try {
        const repository = await Repository.findById(id)
            .populate("owner", "username email")
            .populate("issues");

        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        res.json(repository);
    } catch (err) {
        console.error("Error fetching repository: ", err.message);
        res.status(500).send("Server Error");
    }
}

/**
 * @desc Get repository by name
 * @route GET /repos/name/:name
 * @access Public
 */
async function fetchRepositoryByName(req, res) {
    const { name } = req.params;
    try {
        const repository = await Repository.findOne({ name })
            .populate("owner", "username email")
            .populate("issues");

        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        res.json(repository);
    } catch (err) {
        console.error("Error fetching repository by name: ", err.message);
        res.status(500).send("Server Error");
    }
}

/**
 * @desc Get all repositories of current logged-in user
 * @route GET /repos/my
 * @access Private
 */
async function fetchRepositoryForCurrentUser(req, res) {
    const userId = req.user;
    try {
        const repositories = await Repository.find({ owner: userId });

        if (!repositories || repositories.length === 0) {
            return res.status(404).json({ error: "User Repositories not found" });
        }

        res.json(repositories);
    } catch (err) {
        console.error("Error fetching current user repositories: ", err.message);
        res.status(500).send("Server Error");
    }
}

/**
 * @desc Update repository content/description
 * @route PUT /repos/:id
 * @access Private (owner only)
 */
async function updateRepositoryById(req, res) {
    const { id } = req.params;
    const { content, description } = req.body;
    const userId = req.user;

    try {
        const repository = await Repository.findById(id);

        if (!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }

        if (repository.owner.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized" });
        }

        if (content) repository.content.push(content);
        if (description) repository.description = description;

        const updatedRepository = await repository.save();

        res.json({
            message: "Repository updated successfully",
            repository: updatedRepository,
        });
    } catch (err) {
        console.error("Error updating repository: ", err.message);
        res.status(500).send("Server Error");
    }
}

/**
 * @desc Toggle repository visibility
 * @route PATCH /repos/:id/visibility
 * @access Private (owner only)
 */
async function toggleVisibilityById(req, res) {
    const { id } = req.params;
    const userId = req.user;

    try {
        const repository = await Repository.findById(id);

        if (!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }

        if (repository.owner.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized" });
        }

        repository.visibility = !repository.visibility;
        const updatedRepository = await repository.save();

        res.json({
            message: "Repository visibility successfully changed",
            repository: updatedRepository,
        });
    } catch (err) {
        console.error("Error toggling repository visibility: ", err.message);
        res.status(500).send("Server Error");
    }
}

/**
 * @desc Delete repository by ID
 * @route DELETE /repos/:id
 * @access Private (owner only)
 */
async function deleteRepositoryById(req, res) {
    const { id } = req.params;
    const userId = req.user;

    try {
        const repository = await Repository.findById(id);

        if (!repository) {
            return res.status(404).json({ error: "Repository not found" });
        }

        if (repository.owner.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized" });
        }

        await Issue.deleteMany({ repository: repository._id });

        await repository.deleteOne();


        res.json({ message: "Repository deleted successfully" });
    } catch (err) {
        console.error("Error deleting repository: ", err.message);
        res.status(500).send("Server Error");
    }
}

module.exports = {
    createRepository,
    getAllRepository,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoryForCurrentUser,
    updateRepositoryById,
    toggleVisibilityById,
    deleteRepositoryById,
};
