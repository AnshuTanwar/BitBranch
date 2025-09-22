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
 * @route GET /issues
 * @access Public
 */
const getAllIssuesGlobal = asyncHandler(async (req, res) => {
    console.log('=== GET ALL ISSUES GLOBAL ===');
    console.log('Request URL:', req.originalUrl);
    
    const issues = await Issue.find()
        .populate("author", "username")
        .populate("assignee", "username")
        .populate("repository", "name")
        .sort({ createdAt: -1 });

    console.log('Found issues:', issues.length);
    res.json(issues);
});

/**
 * @route GET /issues/repo/:repoId
 * @access Public
 */
const getAllIssues = asyncHandler(async (req, res) => {
    const { repoId } = req.params;
    
    console.log('=== GET REPOSITORY ISSUES ===');
    console.log('Request URL:', req.originalUrl);
    console.log('Repository ID:', repoId);

    const issues = await Issue.find({ repository: repoId })
        .populate("author", "username")
        .populate("assignee", "username")
        .populate("repository", "name")
        .sort({ createdAt: -1 });

    console.log('Found issues for repo:', issues.length);
    res.json(issues);
});

/**
 * @route GET /issues/:id
 * @access Public
 */
const getIssueById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    console.log('=== GET ISSUE BY ID ===');
    console.log('Request URL:', req.originalUrl);
    console.log('Issue ID:', id);

    const issue = await Issue.findById(id)
        .populate("author", "username email")
        .populate("assignee", "username email")
        .populate("repository", "name owner");

    console.log('Issue found:', issue ? 'Yes' : 'No');

    if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
    }

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
 * @route PUT /issues/:id/comments/:commentId
 * @access Private (comment author only)
 */
const updateComment = asyncHandler(async (req, res) => {
    const { id, commentId } = req.params;
    const { content } = req.body;
    const userId = req.user;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author of the comment
    if (comment.author.toString() !== userId) {
        return res.status(403).json({ message: "Not authorized to update this comment" });
    }

    comment.content = content;
    await comment.save();

    await comment.populate("author", "username email");
    res.json(comment);
});

/**
 * @route DELETE /issues/:id/comments/:commentId
 * @access Private (comment author only)
 */
const deleteComment = asyncHandler(async (req, res) => {
    const { id, commentId } = req.params;
    const userId = req.user;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author of the comment
    if (comment.author.toString() !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    res.json({ message: "Comment deleted successfully" });
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

/**
 * @route PATCH /issues/:id/close
 * @access Private
 */
const closeIssue = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const issue = await Issue.findByIdAndUpdate(
        id,
        { status: "closed" },
        { new: true }
    ).populate("author", "username email")
     .populate("assignee", "username email");

    if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
});

/**
 * @route PATCH /issues/:id/reopen
 * @access Private
 */
const reopenIssue = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const issue = await Issue.findByIdAndUpdate(
        id,
        { status: "open" },
        { new: true }
    ).populate("author", "username email")
     .populate("assignee", "username email");

    if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
});

module.exports = {
    createIssue,
    getAllIssuesGlobal,
    getAllIssues,
    getIssueById,
    updateIssueById,
    updateIssueStatus,
    assignIssue,
    addComment,
    getComments,
    updateComment,
    deleteComment,
    deleteIssueById,
    closeIssue,
    reopenIssue,
};
