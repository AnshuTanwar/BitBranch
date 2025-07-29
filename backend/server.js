const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const yargs = require('yargs');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const mainRouter = require('./routes/main.router.js');

dotenv.config();

const { hideBin } = require("yargs/helpers");
const { initRepo } = require('./controllers/init.js');
const { addRepo } = require('./controllers/add.js');
const { commitRepo } = require('./controllers/commit.js');
const { pullRepo } = require('./controllers/pull.js');
const { pushRepo } = require('./controllers/push.js');
const { revertRepo } = require('./controllers/revert.js');

yargs(hideBin(process.argv))
    .command('start', "Starts a new server", {}, startServer)
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


function startServer () {
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(express.json());

    const mongoURI = process.env.MONGODB_URI;

    mongoose.connect(mongoURI)
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.error("Unable to connect : ", err));
    
    app.use(cors({ origin: "*" }));

    app.use('/', mainRouter);

    let user = "test";

    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        socket.on("joinRoom", (userID) => {
            user = userID;
            console.log("====");
            console.log(user);
            console.log("====");
            socket.join(userID);
        });
    });

    const db = mongoose.connection;

    db.once("open", async() => {
        console.log("CRUD operatoin called");
    });

    httpServer.listen(port, () => {
        console.log(`Server is running on the PORT ${port}`);
    });

}