// config/socket.js
const { Server } = require("socket.io");

function initSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("⚡ User connected:", socket.id);

        socket.on("joinRoom", (userID) => {
            console.log(`User ${userID} joined room`);
            socket.join(userID);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
}

module.exports = initSocket;
