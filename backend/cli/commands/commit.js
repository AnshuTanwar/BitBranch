require('dotenv').config();
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const readline = require("readline");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { STAGING_DIR, COMMITS_DIR, HEAD_FILE, REPO_DIR } = require("../constants");
const { analyzeCode } = require("./quality");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function promptUser(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

async function generateGeminiCommitMessage(stagedFiles) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Generate a short, professional Git commit message for these staged files: ${stagedFiles.join(", ")}.
Respond with ONLY the commit message (single line).`;
        const result = await model.generateContent(prompt);

        let message = result.response.text().trim();
        if (message.includes("\n")) {
            message = message.split("\n")[0].trim();
        }
        return message;
    } catch (err) {
        console.error("Gemini commit message generation failed:", err.message);
        return "update files";
    }
}

async function commitRepo(message, { ai = false } = {}) {
    try {
        const stagedFiles = await fs.readdir(STAGING_DIR);
        if (stagedFiles.length === 0) {
            console.log("⚠️ Nothing to commit.");
            return;
        }

        // If no commit message → use Gemini
        if (!message) {
            const aiMsg = await generateGeminiCommitMessage(stagedFiles);
            if (ai) {
                message = aiMsg;
                console.log(` Auto-commit with AI message: "${message}"`);
            } else {
                const answer = await promptUser(` Suggested commit message: "${aiMsg}"\nUse this? (y/n): `);
                if (answer.toLowerCase() === "y") {
                    message = aiMsg;
                } else {
                    message = await promptUser("Enter your commit message: ");
                }
            }
        }

        // ✅ Run quality check before committing
        const stagedPaths = stagedFiles.map(f => path.join(STAGING_DIR, f));
        const report = await analyzeCode(stagedPaths);

        console.log("\n Code Quality Report:");
        console.log(`- Errors: ${report.totalErrors}`);
        console.log(`- Warnings: ${report.totalWarnings}`);
        console.log(`- Score: ${report.score}/100`);
        if (report.issues.length > 0) {
            console.log("\n⚠️ Issues (showing first 5):");
            for (const issue of report.issues.slice(0, 5)) {
                console.log(`  - ${issue.file}:${issue.line} [${issue.severity}] ${issue.message}`);
            }
        }

        // Get parent commit
        let parent = "";
        try {
            const headContent = (await fs.readFile(HEAD_FILE, "utf8")).trim();
            if (headContent.startsWith("ref:")) {
                const branchRef = headContent.split("ref:")[1].trim();
                parent = (await fs.readFile(path.join(REPO_DIR, branchRef), "utf8").catch(() => "")) || "";
            } else {
                parent = headContent;
            }
        } catch {}

        // New commit
        const commitID = uuidv4();
        const commitDir = path.join(COMMITS_DIR, commitID);
        await fs.mkdir(commitDir, { recursive: true });

        // Copy staged files
        for (const file of stagedFiles) {
            await fs.copyFile(path.join(STAGING_DIR, file), path.join(commitDir, file));
        }

        // Save commit metadata
        const commitData = {
            id: commitID,
            message,
            timestamp: new Date().toISOString(),
            parent,
            quality: report, // save score with commit
        };
        await fs.writeFile(path.join(commitDir, "commit.json"), JSON.stringify(commitData, null, 2));

        // Clear staging area
        for (const file of stagedFiles) {
            await fs.unlink(path.join(STAGING_DIR, file));
        }

        // Update HEAD
        let headContent = await fs.readFile(HEAD_FILE, "utf8").catch(() => "");
        if (headContent.startsWith("ref:")) {
            const branchRef = headContent.split("ref:")[1].trim();
            await fs.writeFile(path.join(REPO_DIR, branchRef), commitID);
            await fs.writeFile(HEAD_FILE, `ref: ${branchRef}`);
        } else {
            await fs.writeFile(HEAD_FILE, commitID);
            console.log("⚠️ Commit made in detached HEAD state (not on any branch)");
        }

        console.log(`\n Commit ${commitID} created with message: "${message}"`);
    } catch (err) {
        console.error(" Error committing files:", err);
    }
}

module.exports = commitRepo;
