const fs = require("fs").promises;
const { REPO_DIR, COMMITS_DIR, STAGING_DIR, CONFIG_FILE, HEAD_FILE } = require("../constants");

async function initRepo() {
    try {
        await fs.mkdir(REPO_DIR, { recursive: true });
        await fs.mkdir(COMMITS_DIR, { recursive: true });
        await fs.mkdir(STAGING_DIR, { recursive: true });

        await fs.writeFile(CONFIG_FILE, JSON.stringify({ bucket: process.env.S3_BUCKET }, null, 2));
        await fs.writeFile(HEAD_FILE, "");

        console.log("✅ BitBranch repository initialized.");
    } catch (err) {
        console.error("❌ Error initializing repository:", err);
    }
}

module.exports = initRepo;
