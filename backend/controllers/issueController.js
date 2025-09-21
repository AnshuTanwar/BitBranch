// controllers/issueController.js
const asyncHandler = require("../utils/asyncHandler");
const Issue = require("../models/issueModel.js");
const Comment = require("../models/commentModel.js");
const Repository = require("../models/repoModel.js");
const User = require("../models/userModel.js");

/**
 * @route POST /issues/create/:repoId
 * @access Private
 */
const createIssue = asyncHandler(async (req, res) => {
    const { title, description, priority, labels } = req.body;
    const { repoId } = req.params;
    const authorId = req.user;

    // repo must exist
    const repo = await Repository.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    const issue = new Issue({
        title,
        description,
        priority: priority || undefined,
        labels: Array.isArray(labels) ? labels : [],
        repository: repoId,
        author: authorId,
    });

    await issue.save();

    // optional: populate author before sending
    await issue.populate("author", "username email");

    res.status(201).json(issue);
});

/**
 * @route GET /issues/repo/:repoId
 * @access Public
 */
const getAllIssues = asyncHandler(async (req, res) => {
    const { repoId } = req.params;

    const issues = await Issue.find({ repository: repoId })
    .populate("author", "username email")
    .populate("assignee", "username email")
    .populate({
        path: "comments",
        populate: { path: "author", select: "username email" },
    })
    .sort({ createdAt: -1 });

    res.json(issues);
});

/**
 * @route GET /issues/:id
 * @access Public
 */
const getIssueById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const issue = await Issue.findById(id)
    .populate("author", "username email")
    .populate("assignee", "username email")
    .populate({
        path: "comments",
        populate: { path: "author", select: "username email" },
    });

    if (!issue) return res.status(404).json({ message: "Issue not found" });

    res.json(issue);
});

/**
 * @route PUT /issues/update/:id
 * @access Private (author or repo owner)
 */
const updateIssueById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, priority, labels } = req.body;
    const userId = req.user;

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const repo = await Repository.findById(issue.repository);
    // only issue author or repo owner can update general fields
    if (issue.author.toString() !== userId && repo.owner.toString() !== userId) {
        return res.status(403).json({ message: "Not authorized" });
    }

    if (title) issue.title = title;
    if (description) issue.description = description;
    if (priority) issue.priority = priority;
    if (labels) issue.labels = labels;

    await issue.save();

    await issue.populate("author", "username email").populate("assignee", "username email");

    res.json(issue);
});

/**
 * @route PUT /issues/:id/status
 * @access Private (author | assignee | repo owner)
 */
const updateIssueStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user;

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const repo = await Repository.findById(issue.repository);

    const allowed =
        issue.author?.toString() === userId ||
        (issue.assignee && issue.assignee.toString() === userId) ||
        (repo && repo.owner.toString() === userId);

    if (!allowed) return res.status(403).json({ message: "Not authorized to change status" });

    issue.status = status;
    await issue.save();

    res.json(issue);
});

/**
 * @route PUT /issues/:id/assign
 * @access Private (repo owner | issue author)
 * body: { userId }
 */
const assignIssue = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const requester = req.user;

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const repo = await Repository.findById(issue.repository);

    if (repo.owner.toString() !== requester && issue.author.toString() !== requester) {
        return res.status(403).json({ message: "Not authorized to assign issue" });
    }

    // validate assignee exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Assignee user not found" });

    issue.assignee = userId;
    await issue.save();

    await issue.populate("assignee", "username email");

    res.json(issue);
});

/**
 * @route POST /issues/:id/comments
 * @access Private
 * body: { content }
 */
const addComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const authorId = req.user;

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const comment = new Comment({
        content,
        author: authorId,
        issue: id,
    });

    await comment.save();

    // push comment into issue.comments
    issue.comments.push(comment._id);
    await issue.save();

    await comment.populate("author", "username email");

    res.status(201).json(comment);
});

/**
 * @route GET /issues/:id/comments
 * @access Public
 */
const getComments = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const comments = await Comment.find({ issue: id })
    .populate("author", "username email")
    .sort({ createdAt: -1 });

    res.json(comments);
});

/**
 * @route DELETE /issues/delete/:id
 * @access Private (repo owner | issue author)
 */
const deleteIssueById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const requester = req.user;

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const repo = await Repository.findById(issue.repository);
    if (repo.owner.toString() !== requester && issue.author.toString() !== requester) {
        return res.status(403).json({ message: "Not authorized to delete issue" });
    }

    // delete related comments
    await Comment.deleteMany({ issue: issue._id });

    await issue.deleteOne();

    res.json({ message: "Issue deleted" });
});

module.exports = {
    createIssue,
    getAllIssues,
    getIssueById,
    updateIssueById,
    updateIssueStatus,
    assignIssue,
    addComment,
    getComments,
    deleteIssueById,
};
