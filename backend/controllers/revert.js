const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { s3, S3_BUCKET } = require('../config/aws-config.js');

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function revertRepo(commitID) {
    const repoPath = path.resolve(process.cwd(), ".myGit");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const commitDir = path.join(commitsPath, commitID);
        const files = await readdir(commitDir);
        const parentDir = path.resolve(repoPath, "..");

        for(const file of files) {
            await copyFile(path.join(commitDir, file), path.join(parentDir, file));
        }

        console.log(`Commit ${commitID} reverted successfully`);

    } catch (err) {
        console.error("Unable to revert : ", err);
    }
}

module.exports = { revertRepo };