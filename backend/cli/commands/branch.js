const fs = require("fs").promises;
const path = require("path");
const { HEAD_FILE, REPO_DIR, COMMITS_DIR } = require("../constants");

async function branchRepo(branchName) {
    try {
        const refsDir = path.join(REPO_DIR, "refs", "heads");
        await fs.mkdir(refsDir, { recursive: true });

        if (!branchName) {
            // list all branches
            let headContent = await fs.readFile(HEAD_FILE, "utf8").catch(() => "");
            let currentBranch = "";
            if (headContent.startsWith("ref:")) {
                currentBranch = headContent.split("ref:")[1].trim().replace("refs/heads/", "");
            }

            for (const b of branches) {
                if (b === currentBranch) {
                    console.log(`* ${b}`);
                } else {
                    console.log(`  ${b}`);
                }
            }


            const branches = await fs.readdir(refsDir).catch(() => []);
            for (const b of branches) {
                if (b === currentBranch) {
                    console.log(`* ${b}`);
                } else {
                    console.log(`  ${b}`);
                }
            }
            return;
        }

        // get current commit from HEAD
        let head = "";
        try {
            const content = await fs.readFile(HEAD_FILE, "utf8");
            if (content.startsWith("ref:")) {
                const branchRef = content.split("ref:")[1].trim();
                head = await fs.readFile(path.join(REPO_DIR, branchRef), "utf8").catch(() => "");
            } else {
                head = content.trim();
            }
        } catch {}

        // write new branch file
        const branchFile = path.join(refsDir, branchName);
        await fs.writeFile(branchFile, head);
        console.log(`✅ Branch '${branchName}' created at ${head || "no commit yet"}`);
    } catch (err) {
        console.error("❌ Error creating branch:", err);
    }
}

module.exports = branchRepo;
