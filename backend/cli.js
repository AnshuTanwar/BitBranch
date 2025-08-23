const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const {
    initRepo,
    addRepo,
    commitRepo,
    pushRepo,
    pullRepo,
    revertRepo,
    logRepo,
    statusRepo,
    diffRepo,
    branchRepo,
    checkoutRepo,
} = require("./cli/commands");

yargs(hideBin(process.argv))
    .command("init", "Initialize a new repository", {}, initRepo)
    .command(
        "add <file>",
        "Add a file to the staging area",
        y => y.positional("file", { type: "string", describe: "File to add" }),
        argv => addRepo(argv.file)
    )
    .command(
        "commit [message]",
        "Commit staged files",
        y => y
            .positional("message", { type: "string", describe: "Commit message" })
            .option("ai", {
                alias: "a",
                type: "boolean",
                default: false,
                describe: "Automatically accept AI-suggested commit message",
            }),
        argv => commitRepo(argv.message, { ai: argv.ai })
    )
    .command("push", "Push commits to S3", {}, pushRepo)
    .command("pull", "Pull commits from S3", {}, pullRepo)
    .command(
        "revert <commitID>",
        "Revert to a specific commit",
        y => y.positional("commitID", { type: "string", describe: "Commit ID to revert to" }),
        argv => revertRepo(argv.commitID)
    )
    .command(
        "log",
        "Show commit history from HEAD",
        y => y.option("oneline", { type: "boolean", default: false, describe: "Condensed view" }),
        argv => logRepo({ oneline: argv.oneline })
    )
    .command("status", "Show working tree status", {}, statusRepo)
    .command("diff", "Show changes between working dir and last commit", {}, diffRepo)
    .command(
        "branch [name]",
        "List branches or create a new one",
        y => y.positional("name", { type: "string", describe: "Branch name" }),
        argv => argv.name ? branchRepo(argv.name) : branchRepo()
    )
    .command(
        "checkout <name>",
        "Switch to a branch or commit",
        y => y.positional("name", { type: "string", describe: "Branch name or commit ID" }),
        argv => checkoutRepo(argv.name)
    )
    .demandCommand(1)
    .help().argv;
