const mongoose = require("mongoose");
const Repository = require("../models/repoModel.js");
const Issue = require("../models/issueModel.js");

/**
 * @desc   Create new issue in a repository
 * @route  POST /issues/:repoId
 * @access Private
 */
async function createIssue(req, res) {
    const { title, description } = req.body;
    const { repoId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(repoId)) {
            return res.status(400).json({ error: "Invalid repository ID" });
        }

        const repo = await Repository.findById(repoId);
        if (!repo) {
            return res.status(404).json({ error: "Repository not found" });
        }

        const issue = new Issue({
            title,
            description,
            repository: repoId,
        });

        await issue.save();

        // Push issue id into repository.issues[]
        repo.issues.push(issue._id);
        await repo.save();

        res.status(201).json({
            message: "Issue created successfully",
            issue,
        });
    } catch (err) {
        console.error("Error creating issue:", err.message);
        res.status(500).send("Server error");
    }
}

/**
 * @desc   Update issue
 * @route  PUT /issues/:id
 * @access Private
 */
async function updateIssueById(req, res) {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try {
        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({ error: "Issue not found!" });
        }

        if (title) issue.title = title;
        if (description) issue.description = description;
        if (status) issue.status = status;

        await issue.save();

        res.json({
            message: "Issue updated successfully",
            issue,
        });
    } catch (err) {
        console.error("Error updating issue:", err.message);
        res.status(500).send("Server error");
    }
}

/**
 * @desc   Delete issue
 * @route  DELETE /issues/:id
 * @access Private
 */
async function deleteIssueById(req, res) {
    const { id } = req.params;

    try {
        const issue = await Issue.findByIdAndDelete(id);

        if (!issue) {
            return res.status(404).json({ error: "Issue not found!" });
        }

        // Remove from repo.issues array also
        await Repository.findByIdAndUpdate(issue.repository, {
            $pull: { issues: issue._id },
        });

        res.json({ message: "Issue deleted successfully" });
    } catch (err) {
        console.error("Error deleting issue:", err.message);
        res.status(500).send("Server error");
    }
}

/**
 * @desc   Get all issues for a repository
 * @route  GET /issues/repo/:repoId
 * @access Public
 */
async function getAllIssues(req, res) {
    const { repoId } = req.params;

    try {
        const issues = await Issue.find({ repository: repoId });

        if (!issues || issues.length === 0) {
            return res.status(404).json({ error: "No issues found" });
        }

        res.status(200).json(issues);
    } catch (err) {
        console.error("Error fetching issues:", err.message);
        res.status(500).send("Server error");
    }
}

/**
 * @desc   Get issue by ID
 * @route  GET /issues/:id
 * @access Public
 */
async function getIssueById(req, res) {
    const { id } = req.params;
    try {
        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({ error: "Issue not found!" });
        }

        res.json(issue);
    } catch (err) {
        console.error("Error fetching issue:", err.message);
        res.status(500).send("Server error");
    }
}

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById,
};
