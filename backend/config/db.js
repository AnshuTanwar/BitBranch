const mongoose = require("mongoose");

async function connectDB(mongoURI) {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }

    // Error handling
    mongoose.connection.on("error", (err) => {
        console.error("MongoDB error:", err);
    });

   // Graceful shutdown
    process.on("SIGINT", async () => {
        await mongoose.connection.close();
        console.log("MongoDB disconnected on app termination");
        process.exit(0);
    });
}

module.exports = connectDB;
