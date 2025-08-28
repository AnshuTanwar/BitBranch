const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const msg = errors.array().map(e => `${e.param}: ${e.msg}`).join(" | ");
        return next(new AppError(msg, 422));
    }
    next();
};
