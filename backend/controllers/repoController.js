const createRepository = (req, res) => {
    res.send("Repo createde");
};

const getAllRepository = (req, res) => {
    res.send("all repo fetched");
};

const fetchRepositoryById = (req, res) => {
    res.send("Repo details fetched");
};

const fetchRepositoryByName = (req, res) => {
    res.send("Repo details fetched");
};

const fetchRepositoryForCurrentUser = (req, res) => {
    res.send("Repo for logged in user");
};

const updateRepositoryById = (req, res) => {
    res.send("Repo updated");
};

const toggleVisibiityById = (req, res) => {
    res.send("Repo public/private");
};

const deleteRepositoryById = (req, res) => {
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