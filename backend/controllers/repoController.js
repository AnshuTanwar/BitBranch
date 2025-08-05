const mongoose = require('mongoose');

async function createRepository(req, res) {
    res.send("Repo createde");
};

async function getAllRepository(req, res) {
    res.send("all repo fetched");
};

async function fetchRepositoryById(req, res) {
    res.send("Repo details fetched");
};

async function fetchRepositoryByName(req, res) {
    res.send("Repo details fetched");
};

async function fetchRepositoryForCurrentUser(req, res) {
    res.send("Repo for logged in user");
};

async function updateRepositoryById(req, res) {
    res.send("Repo updated");
};

async function toggleVisibiityById(req, res) {
    res.send("Repo public/private");
};

async function deleteRepositoryById(req, res) {
    res.send("repo deleted");
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