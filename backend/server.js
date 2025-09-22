const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const mainRouter = require("./routes/main.router.js");
const connectDB = require("./config/db.js");
const initSocket = require("./config/socket.js");
const { notFound, errorHandler } = require("./middleware/error.js");

dotenv.config();

async function startServer() {
    const app = express();
    const port = process.env.PORT || 5050;
    const mongoURI = process.env.MONGODB_URI;

    // Allowed origins
    const allowedOrigins = [
        "https://bit-branch.vercel.app",
        "https://bit-branch-mgfsf9ee6-anshutanwars-projects.vercel.app"
    ];

    // CORS middleware
    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    }));

    // Middleware
    app.use(express.json());

    // DB Connection
    await connectDB(mongoURI);

    // Routes
    app.use("/api", mainRouter);

    // Error middleware
    app.use(notFound);
    app.use(errorHandler);

    // HTTP + Socket.IO
    const httpServer = http.createServer(app);
    initSocket(httpServer);

    httpServer.listen(port, () => {
        console.log(`Server running on PORT ${port}`);
    });
}

startServer();
