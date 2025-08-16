// cli/constants.js
const path = require("path");

const REPO_DIR = path.resolve(process.cwd(), ".bitbranch");
const COMMITS_DIR = path.join(REPO_DIR, "commits");
const STAGING_DIR = path.join(REPO_DIR, "staging");
const CONFIG_FILE = path.join(REPO_DIR, "config.json");
const HEAD_FILE = path.join(REPO_DIR, "HEAD");

module.exports = {
    REPO_DIR,
    COMMITS_DIR,
    STAGING_DIR,
    CONFIG_FILE,
    HEAD_FILE,
};
