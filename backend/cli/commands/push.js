const fs = require("fs").promises;
const path = require("path");
const { ListObjectsV2Command, PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3, S3_BUCKET } = require("../../config/aws-config");
const { COMMITS_DIR } = require("../constants");

async function pushRepo() {
    try {
        // Get existing commits in S3
        const data = await s3.send(
            new ListObjectsV2Command({ Bucket: S3_BUCKET, Prefix: "commits/" })
        );
        const existingKeys = new Set((data.Contents || []).map(obj => obj.Key));

        // Loop through local commits
        const commitDirs = await fs.readdir(COMMITS_DIR);
        for (const commitDir of commitDirs) {
            const commitPath = path.join(COMMITS_DIR, commitDir);
            const files = await fs.readdir(commitPath);

            for (const file of files) {
                const s3Key = `commits/${commitDir}/${file}`;
                const filePath = path.join(commitPath, file);

                if (existingKeys.has(s3Key)) {
                    console.log(`⏩ Skipped (already in S3): ${s3Key}`);
                    continue;
                }

                const fileContent = await fs.readFile(filePath);

                await s3.send(
                    new PutObjectCommand({
                        Bucket: S3_BUCKET,
                        Key: s3Key,
                        Body: fileContent,
                    })
                );

                console.log(`⬆️ Uploaded: ${s3Key}`);
            }
        }

        console.log("✅ Push complete (new commits uploaded).");
    } catch (err) {
        console.error("❌ Error pushing to S3:", err);
    }
}

module.exports = pushRepo;
