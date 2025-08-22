const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");
const { STAGING_DIR, COMMITS_DIR, HEAD_FILE } = require("../constants");

async function hashFile(filePath) {
    const content = await fs.readFile(filePath);
    return crypto.createHash("sha1").update(content).digest("hex");
}

// Load ignore patterns from `.bitbranchignore`
async function loadIgnorePatterns() {
    const ignorePath = path.join(process.cwd(), ".bitbranchignore");
    let patterns = [];

    try {
        const content = await fs.readFile(ignorePath, "utf8");
        patterns = content
            .split("\n")
            .map(l => l.trim())
            .filter(l => l && !l.startsWith("#"));
    } catch {}

    // Always ignore these
    patterns.push(".bitbranch", "node_modules");

    return new Set(patterns);
}

async function statusRepo() {
    try {
        const ignorePatterns = await loadIgnorePatterns();
        let head = "";
        try {
            head = (await fs.readFile(HEAD_FILE, "utf8")).trim();
        } catch {}
    
        let lastCommitFiles = {};
        if (head) {
            const commitDir = path.join(COMMITS_DIR, head);
            const files = await fs.readdir(commitDir);
            for (const f of files) {
                if (f === "commit.json") continue;
                lastCommitFiles[f] = await hashFile(path.join(commitDir, f));
            }
        }

        const stagedFiles = new Set(await fs.readdir(STAGING_DIR).catch(() => []));
        const workingFiles = new Set(await fs.readdir(process.cwd()));

        console.log("### Status\n");

        // Unstaged / Modified
        for (const file of workingFiles) {
            if (file.startsWith(".") && file !== ".bitbranchignore") continue;
            if (ignorePatterns.has(file)) continue;

            const filePath = path.join(process.cwd(), file);
            try {
                const hash = await hashFile(filePath);
                if (lastCommitFiles[file] && lastCommitFiles[file] !== hash && !stagedFiles.has(file)) {
                    console.log(`M  ${file} (modified, not staged)`);
                }
            } catch {}
        }

        // Staged
        for (const file of stagedFiles) {
            console.log(`A  ${file} (staged)`);
        }

        // Untracked
        for (const file of workingFiles) {
            if (file.startsWith(".") && file !== ".bitbranchignore") continue;
            if (ignorePatterns.has(file)) continue;
            if (!lastCommitFiles[file] && !stagedFiles.has(file)) {
                console.log(`?? ${file} (untracked)`);
            }
        }

        console.log("\n✔️ Done.");
    } catch (err) {
        console.error("❌ Error showing status:", err);
    }
}

module.exports = statusRepo;
