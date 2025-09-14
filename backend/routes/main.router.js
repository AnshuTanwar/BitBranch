const express = require("express");
const userRouter = require("./user.router.js");
const repoRouter = require("./repo.router.js");
const issueRouter = require("./issue.router.js");

const mainRouter = express.Router();

mainRouter.get("/health", (req, res) => {
    res.send("API is working!");
});

mainRouter.use("/users", userRouter);
mainRouter.use("/repos", repoRouter);
mainRouter.use("/issues", issueRouter);

module.exports = mainRouter;
