const fs = require("fs").promises;
const path = require("path");
const { COMMITS_DIR, HEAD_FILE } = require("../constants");

async function diffRepo() {
    try {
        let head = "";
        try {
            head = (await fs.readFile(HEAD_FILE, "utf8")).trim();
        } catch {
            console.log("⚠️ No commits yet.");
            return;
        }

        if (!head) {
            console.log("⚠️ No commits yet.");
            return;
        }

        const commitDir = path.join(COMMITS_DIR, head);
        const commitFiles = await fs.readdir(commitDir);

        for (const file of commitFiles) {
            if (file === "commit.json") continue;

            const commitPath = path.join(commitDir, file);
            const workingPath = path.join(process.cwd(), file);

            let commitContent = "";
            let workingContent = "";
            try {
                commitContent = (await fs.readFile(commitPath, "utf8")).split("\n");
            } catch {}
            try {
                workingContent = (await fs.readFile(workingPath, "utf8")).split("\n");
            } catch {}

            console.log(`\n--- Diff for ${file} ---`);

            const maxLines = Math.max(commitContent.length, workingContent.length);
            for (let i = 0; i < maxLines; i++) {
                const oldLine = commitContent[i] || "";
                const newLine = workingContent[i] || "";
                if (oldLine !== newLine) {
                    console.log(`- ${oldLine}`);
                    console.log(`+ ${newLine}`);
                }
            }
        }
    } catch (err) {
        console.error("❌ Error showing diff:", err);
    }
}

module.exports = diffRepo;
