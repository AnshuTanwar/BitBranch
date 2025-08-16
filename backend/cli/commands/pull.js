// cli/commands/pull.js
const fs = require("fs").promises;
const path = require("path");
const { ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3, S3_BUCKET } = require("../../config/aws-config");
const { COMMITS_DIR } = require("../constants");
const { pipeline } = require("stream");
const { promisify } = require("util");
const streamPipeline = promisify(pipeline);
const fssync = require("fs"); // for createWriteStream

async function pullRepo() {
    try {
        // Get all commit objects from S3
        const data = await s3.send(
            new ListObjectsV2Command({ Bucket: S3_BUCKET, Prefix: "commits/" })
        );
        const objects = data.Contents || [];

        for (const object of objects) {
            const key = object.Key;
            if (key.endsWith("/")) continue; // skip directory placeholders

            const commitID = key.split("/")[1];
            const localCommitDir = path.join(COMMITS_DIR, commitID);
            const localFilePath = path.join(process.cwd(), ".bitbranch", key);

            // Check if file already exists
            let exists = false;
            try {
                await fs.access(localFilePath);
                exists = true;
            } catch (err) {
                if (err.code !== "ENOENT") {
                    console.error(`❌ Unexpected FS error for ${localFilePath}:`, err);
                    throw err; // stop if not a "file not found" error
                }
            }

            if (exists) {
                console.log(`⏩ Skipped (already exists): ${key}`);
                continue;
            }

            // Ensure commit dir exists
            await fs.mkdir(localCommitDir, { recursive: true });

            // Download from S3
            const { Body } = await s3.send(
                new GetObjectCommand({ Bucket: S3_BUCKET, Key: key })
            );

            await streamPipeline(Body, fssync.createWriteStream(localFilePath));
            console.log(`⬇️ Downloaded: ${key}`);
        }

        console.log("✅ Pull complete (new commits synced).");
    } catch (err) {
        console.error("❌ Error pulling from S3:", err);
    }
}

module.exports = pullRepo;
