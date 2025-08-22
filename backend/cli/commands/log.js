const fs = require("fs").promises;
const path = require("path");
const { COMMITS_DIR, HEAD_FILE, REPO_DIR } = require("../constants");

async function logRepo({ oneline = false } = {}) {
    try {
        let headContent = "";
        try {
            headContent = (await fs.readFile(HEAD_FILE, "utf8")).trim();
        } catch {
            console.log("⚠️ No repository initialized or HEAD missing.");
            return;
        }

        if (!headContent) {
            console.log("ℹ️ No commits yet.");
            return;
        }

        let current = "";
        let headInfo = "";

        if (headContent.startsWith("ref:")) {
            // HEAD points to a branch
            const branchRef = headContent.split("ref:")[1].trim();
            const branchName = branchRef.replace("refs/heads/", "");
            headInfo = `(branch: ${branchName})`;

            try {
                current = (await fs.readFile(path.join(REPO_DIR, branchRef), "utf8")).trim();
            } catch {
                console.log(`⚠️ Branch '${branchName}' has no commits yet.`);
                return;
            }
        } else {
            // Detached HEAD
            current = headContent;
            headInfo = `(detached at ${current.slice(0, 7)})`;
        }

        console.log(`=== BitBranch Log ${headInfo} ===\n`);

        const seen = new Set();
        while (current && !seen.has(current)) {
            seen.add(current);

            const commitMetaPath = path.join(COMMITS_DIR, current, "commit.json");
            let meta;
            try {
                meta = JSON.parse(await fs.readFile(commitMetaPath, "utf8"));
            } catch (err) {
                console.log(`❌ Missing/invalid metadata for commit ${current}`);
                break;
            }

            if (oneline) {
                console.log(`${meta.id.slice(0, 7)} ${meta.message}`);
            } else {
                console.log(`commit ${meta.id}`);
                console.log(`Date:   ${meta.timestamp}`);
                console.log(`\n    ${meta.message}\n`);
            }

            current = meta.parent || "";
        }
    } catch (err) {
        console.error("❌ Error reading log:", err);
    }
}

module.exports = logRepo;
