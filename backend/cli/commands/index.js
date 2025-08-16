const initRepo = require("./init");
const addRepo = require("./add");
const commitRepo = require("./commit");
const pushRepo = require("./push");
const pullRepo = require("./pull");
const revertRepo = require("./revert");
const logRepo = require("./log");
const statusRepo = require("./status");
const diffRepo = require("./diff");
const branchRepo = require("./branch");
const checkoutRepo = require("./checkout");

module.exports = {
    initRepo,
    addRepo,
    commitRepo,
    pushRepo,
    pullRepo,
    revertRepo,
    logRepo,
    statusRepo,
    diffRepo,
    branchRepo,
    checkoutRepo,
};
