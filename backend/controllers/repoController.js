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
    
    console.log('=== FETCH REPOSITORY BY ID ===');
    console.log('Request URL:', req.originalUrl);
    console.log('Request params:', req.params);
    console.log('Fetching repository with ID:', id); // Debug log

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid ObjectId:', id); // Debug log
        return res.status(400).json({ message: "Invalid repository ID" });
    }

    try {
        const repository = await Repository.findById(id)
            .populate("owner", "username email")
            .populate("issues");

        console.log('Repository found:', repository ? 'Yes' : 'No'); // Debug log

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
        const repositories = await Repository.find({ owner: userId })
            .populate('owner', 'username email')
            .populate('issues');

        // Return structured response format
        res.json({ 
            success: true, 
            repos: repositories 
        });
    } catch (err) {
        console.error("Error fetching current user repositories: ", err.message);
        res.status(500).json({ 
            success: false, 
            message: "Server Error",
            error: err.message 
        });
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

// ⭐ Star a repository
async function starRepository(req, res) {
    const userId = req.user;
    const { id } = req.params;

    try {
        const repo = await Repository.findById(id);
        if (!repo) return res.status(404).json({ message: "Repository not found" });

        const user = await User.findById(userId);

        // check if already starred
        if (user.starredRepos.includes(id)) {
            return res.status(400).json({ message: "Repository already starred" });
        }

        // update user + repo
        user.starredRepos.push(id);
        repo.stars += 1;

        await user.save();
        await repo.save();

        res.json({ message: "Repository starred successfully", stars: repo.stars });
    } catch (err) {
        console.error("Error starring repo:", err.message);
        res.status(500).send("Server error");
    }
}

//  ⭐ Unstar a repository
async function unstarRepository(req, res) {
    const userId = req.user;
    const { id } = req.params;

    try {
        const repo = await Repository.findById(id);
        if (!repo) return res.status(404).json({ message: "Repository not found" });

        const user = await User.findById(userId);

        // check if repo was starred
        if (!user.starredRepos.includes(id)) {
            return res.status(400).json({ message: "Repository not starred yet" });
        }

        // update user + repo
        user.starredRepos = user.starredRepos.filter(r => r.toString() !== id);
        repo.stars = Math.max(repo.stars - 1, 0);

        await user.save();
        await repo.save();

        res.json({ message: "Repository unstarred successfully", stars: repo.stars });
    } catch (err) {
        console.error("Error unstarring repo:", err.message);
        res.status(500).send("Server error");
    }
}

// ⭐ Get all starred repos of current user
async function getStarredRepositories(req, res) {
    const userId = req.user;

    try {
        const user = await User.findById(userId).populate("starredRepos");
        res.json(user.starredRepos || []);
    } catch (err) {
        console.error("Error fetching starred repos:", err.message);
        res.status(500).send("Server error");
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
    starRepository,
    unstarRepository,
    getStarredRepositories,
};
