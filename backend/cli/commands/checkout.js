const fs = require("fs").promises;
const path = require("path");
const { HEAD_FILE, REPO_DIR, COMMITS_DIR } = require("../constants");

async function checkoutRepo(branchName) {
    try {
        const branchFile = path.join(REPO_DIR, "refs", "heads", branchName);

        let commitID = "";
        try {
            commitID = (await fs.readFile(branchFile, "utf8")).trim();
        } catch {
            console.error(`❌ Branch '${branchName}' does not exist.`);
            return;
        }

        // update HEAD to point to branch
        await fs.writeFile(HEAD_FILE, `ref: refs/heads/${branchName}`);

        if (!commitID) {
            console.log(`✅ Switched to new branch '${branchName}' (no commits yet)`);
            return;
        }

        // restore files from commit
        const commitDir = path.join(COMMITS_DIR, commitID);
        const files = await fs.readdir(commitDir);
        for (const f of files) {
            if (f === "commit.json") continue;
            const src = path.join(commitDir, f);
            const dest = path.join(process.cwd(), f);
            await fs.copyFile(src, dest);
        }

        console.log(`✅ Switched to branch '${branchName}' at commit ${commitID}`);
    } catch (err) {
        console.error("❌ Error checking out branch:", err);
    }
}

module.exports = checkoutRepo;
