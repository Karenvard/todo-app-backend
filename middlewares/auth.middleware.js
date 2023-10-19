"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
var error_controller_1 = require("../controllers/error.controller");
var jwt = require("jsonwebtoken");
function authMiddleware(req, res, next) {
    try {
        var token = req.headers["authorization"].split(" ")[1];
        if (!token)
            return (0, error_controller_1.errorController)(res, "unauthorized", "auth", "Error. Please sign in.");
        var user = jwt.verify(token, process.env.SECRET_KEY);
        req.user = user;
        next();
    }
    catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            return (0, error_controller_1.errorController)(res, "unauthorized", "auth-expired", "Session is expired. Please sign in.");
        }
        console.log(e.message);
        return (0, error_controller_1.errorController)(res, "unauthorized", "auth", "Server error. Please try to sign in.");
    }
}
exports.authMiddleware = authMiddleware;
