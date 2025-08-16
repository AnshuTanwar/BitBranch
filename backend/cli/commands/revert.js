const fs = require("fs").promises;
const path = require("path");
const { COMMITS_DIR, HEAD_FILE } = require("../constants");

async function revertRepo(commitID) {
    try {
        const commitDir = path.join(COMMITS_DIR, commitID);

        // Check if commit exists
        try {
            await fs.access(commitDir);
        } catch {
            console.error(`❌ Commit ${commitID} does not exist.`);
            return;
        }

        // Copy all files from commit back to working directory
        const files = await fs.readdir(commitDir);
        for (const file of files) {
            if (file === "commit.json") continue; // skip metadata
            const src = path.join(commitDir, file);
            const dest = path.join(process.cwd(), file);

            await fs.copyFile(src, dest);
            console.log(`↩️ Restored: ${file}`);
        }

        // Update HEAD pointer
        await fs.writeFile(HEAD_FILE, commitID);
        console.log(`✅ Reverted to commit ${commitID}`);
    } catch (err) {
        console.error("❌ Error reverting commit:", err);
    }
}

module.exports = revertRepo;
