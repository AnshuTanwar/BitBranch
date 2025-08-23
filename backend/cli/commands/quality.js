// cli/commands/quality.js
const { ESLint } = require("eslint");
const fs = require("fs").promises;

async function analyzeCode(files) {
    const eslint = new ESLint({
        overrideConfigFile: true, // tell ESLint to use flat config instead of searching
        overrideConfig: {
            files: ["**/*.js"],
            languageOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                globals: { console: "readonly" }
            },
            rules: {
                semi: ["error", "always"],
                "no-unused-vars": "warn",
                "no-undef": "error"
            }
        }
    });

    let totalErrors = 0;
    let totalWarnings = 0;
    const issues = [];

    for (const file of files) {
        const code = await fs.readFile(file, "utf8");
        const results = await eslint.lintText(code, { filePath: file });

        for (const res of results) {
            totalErrors += res.errorCount;
            totalWarnings += res.warningCount;
            res.messages.forEach(msg => {
                issues.push({
                    file: res.filePath,
                    line: msg.line,
                    severity: msg.severity === 2 ? "error" : "warning",
                    message: msg.message
                });
            });
        }
    }

    let score = 100 - (totalErrors * 5 + totalWarnings * 2);
    if (score < 0) score = 0;

    return { score, totalErrors, totalWarnings, issues };
}

module.exports = { analyzeCode };
