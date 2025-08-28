const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const mainRouter = require("./routes/main.router.js");
const connectDB = require("./config/db.js");
const initSocket = require("./config/socket.js");
const { notFound, errorHandler } = require("./mcciddleware/error.js");

dotenv.config();

async function startServer() {
    const app = express();
    const port = process.env.PORT || 5050;
    const mongoURI = process.env.MONGODB_URI;

    // Middlewares
    app.use(express.json());
    app.use(cors({ origin: process.env.CLIENT_URL || "*" }));

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
