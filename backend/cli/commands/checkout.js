const fs = require("fs").promises;
const path = require("path");
const { HEAD_FILE, REPO_DIR, COMMITS_DIR } = require("../constants");

async function checkoutRepo(name) {
    try {
        let commitID = "";
        let isBranch = false;

        const branchFile = path.join(REPO_DIR, "refs", "heads", name);

        // Try branch first
        try {
            commitID = (await fs.readFile(branchFile, "utf8")).trim();
            isBranch = true;
        } catch {
            // Not a branch → maybe commit ID
            const commitDir = path.join(COMMITS_DIR, name);
            try {
                await fs.access(commitDir);
                commitID = name;
            } catch {
                console.error(`No branch or commit '${name}' found.`);
                return;
            }
        }

        // Update HEAD
        if (isBranch) {
            await fs.writeFile(HEAD_FILE, `ref: refs/heads/${name}`);
        } else {
            await fs.writeFile(HEAD_FILE, commitID); // detached HEAD
        }

        if (!commitID) {
            console.log(`Switched to ${isBranch ? "branch" : "commit"} '${name}' (no commits yet)`);
            return;
        }

        // Restore files from commit
        const commitDir = path.join(COMMITS_DIR, commitID);
        const files = await fs.readdir(commitDir);
        for (const f of files) {
            if (f === "commit.json") continue;
            const src = path.join(commitDir, f);
            const dest = path.join(process.cwd(), f);
            await fs.copyFile(src, dest);
        }

        if (isBranch) {
            console.log(`Switched to branch '${name}' at commit ${commitID}`);
        } else {
            console.log(`Detached HEAD at commit ${commitID}`);
        }
    } catch (err) {
        console.error("Error checking out:", err);
    }
}

module.exports = checkoutRepo;
