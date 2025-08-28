const AppError = require("../utils/AppError");

function notFound(req, res, next) {
    next(new AppError(`Not Found - ${req.originalUrl}`, 404));
}

function errorHandler(err, req, res, next) {
  // Mongoose-specific tweaks
    if (err.name === "CastError") {
        err = new AppError("Invalid ID format", 400);
    }
    if (err.name === "ValidationError") {
        const msg = Object.values(err.errors).map(e => e.message).join(", ");
        err = new AppError(msg || "Validation error", 400);
    }

    const status = err.statusCode || 500;
    const payload = {
        success: false,
        message: err.message || "Server Error",
    };

    res.status(status).json(payload);
}

module.exports = { notFound, errorHandler };
