const yargs = require('yargs');
const { hideBin } = require("yargs/helpers");
const { initRepo } = require('./controllers/init.js');
const { addRepo } = require('./controllers/add.js');
const { commitRepo } = require('./controllers/commit.js');
const { pullRepo } = require('./controllers/pull.js');
const { pushRepo } = require('./controllers/push.js');
const { revertRepo } = require('./controllers/revert.js');

yargs(hideBin(process.argv))
    .command(
        'init',
        "Initialise the new repository",
        {},
        initRepo
    )
    .command(
        'add <file>',
        "Add a file to the repository",
        (yargs) => {
            yargs.positional("file", {
                description: "File to add to the staging area",
                type: "string",
            });
        },
        (argv) => {
            addRepo(argv.file);
        }
    )
    .command(
        'commit <message>',
        "Commit the staged files",
        (yargs) => {
            yargs.positional("message", {
                description: "Commit message",
                type: "string",
            });
        },
        (argv) => {
            commitRepo(argv.message);
        }
    )
    .command("push", "Push commits to S3", {}, pushRepo)
    .command("pull", "Pull commits from S3", {}, pullRepo)
    .command(
        'revert <commitID>',
        "Revert a specific commit",
        (yargs) => {
            yargs.positional("commitID", {
                description: "Commit ID to revertt to",
                type: "string",
            });
        },
        (argv) => {
            revertRepo(argv.commitID);
        }
    )
    .demandCommand(1, "You need at least one command")
    .help().argv;