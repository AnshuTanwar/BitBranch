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

        // Check if user exists
        const user = await User.findById(owner);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if repo name is unique
        const existingRepo = await Repository.findOne({ name });
        if (existingRepo) {
            return res.status(400).json({ error: 'Repository name already exists' });
        }

        const newRepository = new Repository({
            name,
            description,
            visibility,
            owner,
            content,
            issues: [],
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
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid repository ID" });
    }

    try{
        const repository = await Repository.find({_id: id})
            .populate("owner")
            .populate("issues");

        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        res.json(repository);

    } catch(err) {
        console.error("Error fetching repository : ", err.message);
        res.status(500).send("Server Error");
    }
};

async function fetchRepositoryByName(req, res) {
    const { name } = req.params;
    try{
        const repository = await Repository.findOne({name})
            .populate("owner")
            .populate("issues");

        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        res.json(repository);

    } catch(err) {
        console.error("Error fetching repository by name : ", err.message);
        res.status(500).send("Server Error");jhb
    }
};

async function fetchRepositoryForCurrentUser(req, res) {
    const userId = req.user;
    try{
        const repositories = await Repository.find({owner: userId});

        if(!repositories || repositories.length == 0) {
            return res.status(404).json({error: "User Repositories not found"});
        }

        res.json({message: "Repositories found"}, repositories);
    } catch(err) {
        console.error("Error Fetching Repository of Current User : ", err.message);
        res.status(500).send("Server Error");
    }
};

async function updateRepositoryById(req, res) {
    const { id } = req.params;
    const { content, description } = req.body;

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