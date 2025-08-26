const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded.id; // 🔑 userId attach
        next();
    } catch (err) {
        console.error("Invalid Token:", err.message);
        res.status(401).json({ message: "Token is not valid" });
    }
}

function generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
}

module.exports = {
    authMiddleware,
    generateToken,
};
