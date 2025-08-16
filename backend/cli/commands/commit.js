const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { STAGING_DIR, COMMITS_DIR, HEAD_FILE } = require("../constants");

async function commitRepo(message) {
    try {
        const stagedFiles = await fs.readdir(STAGING_DIR);
        if (stagedFiles.length === 0) {
            console.log("⚠️ Nothing to commit.");
            return;
        }

        let parent = "";
        try {
            parent = (await fs.readFile(HEAD_FILE, "utf8")).trim();
        } catch {}

        const commitID = uuidv4();
        const commitDir = path.join(COMMITS_DIR, commitID);

        await fs.mkdir(commitDir, { recursive: true });

        for (const file of stagedFiles) {
            await fs.copyFile(path.join(STAGING_DIR, file), path.join(commitDir, file));
        }

        const commitData = {
            id: commitID,
            message,
            timestamp: new Date().toISOString(),
            parent,
        };

        await fs.writeFile(path.join(commitDir, "commit.json"), JSON.stringify(commitData, null, 2));

        // Clear staging area
        for (const file of stagedFiles) {
            await fs.unlink(path.join(STAGING_DIR, file));
        }

        // Update HEAD
        await fs.writeFile(HEAD_FILE, commitID);

        console.log(`✅ Commit ${commitID} created with message: "${message}"`);
    } catch (err) {
        console.error("❌ Error committing files:", err);
    }
}

module.exports = commitRepo;
