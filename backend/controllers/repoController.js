const mongoose = require('mongoose');
const Repository = require('../models/repoModel.js');
const User = require('../models/userModel.js');
const Issue = require('../models/issueModel.js');

async function createRepository(req, res) {
    const { owner, name, issues, content, description, visibility } = req.body;
    try{
        if(!name) {
            return res.status(400).json({error: 'Repository name is required'})
        }

        if(!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({error: 'Invalid User Id'});
        }

        const newRepository = new Repository({
            name,
            description,
            visibility,
            owner,
            content,
            issues,
        });

        const result = await newRepository.save();

        res.status(201).json({
            message: "Repository Created!",
            repositoryID: result._id,
        });

    } catch(err) {
        console.error("Error deleting profile : ", err.message);
        res.status(500).send("Server Error");
    }
};

async function getAllRepository(req, res) {
    try{
        const repositories = await Repository.find({}).populate('owner').populate('issues');
        res.json(repositories);
    } catch(err) {
        console.error("Error deleting profile : ", err.message);
        res.status(500).send("Server Error");
    }
};

async function fetchRepositoryById(req, res) {
    try{

    } catch(err) {
        console.error("Error deleting profile : ", err.message);
        res.status(500).send("Server Error");
    }
};

async function fetchRepositoryByName(req, res) {
    try{

    } catch(err) {
        console.error("Error deleting profile : ", err.message);
        res.status(500).send("Server Error");
    }
};

async function fetchRepositoryForCurrentUser(req, res) {
    try{

    } catch(err) {
        console.error("Error Fetching Repository of Current User : ", err.message);
        res.status(500).send("Server Error");
    }
};

async function updateRepositoryById(req, res) {
    try{

    } catch(err) {
        console.error("Error Updating Repository : ", err.message);
        res.status(500).send("Server Error");
    }
};

async function toggleVisibiityById(req, res) {
    try{

    } catch(err) {
        console.error("Error Toggling Visibility : ", err.message);
        res.status(500).send("Server Error");
    }
};

async function deleteRepositoryById(req, res) {
    try{

    } catch(err) {
        console.error("Error Deleting Repository : ", err.message);
        res.status(500).send("Server Error");
    }
};


module.exports = {
    createRepository,
    getAllRepository,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoryForCurrentUser,
    updateRepositoryById,
    toggleVisibiityById,
    deleteRepositoryById,
}