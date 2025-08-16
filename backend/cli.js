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
        "commit <message>",
        "Commit staged files",
        y => y.positional("message", { type: "string", describe: "Commit message" }),
        argv => commitRepo(argv.message)
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
    .demandCommand(1)
    .help().argv;
