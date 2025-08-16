const fs = require("fs").promises;
const path = require("path");
const { STAGING_DIR } = require("../constants");

async function addRepo(filePath) {
    try {
        await fs.mkdir(STAGING_DIR, { recursive: true });

        const fileName = path.basename(filePath);
        await fs.copyFile(filePath, path.join(STAGING_DIR, fileName));

        console.log(`✅ File ${fileName} added to staging area.`);
    } catch (err) {
        console.error("❌ Error adding file:", err);
    }
}

module.exports = addRepo;
