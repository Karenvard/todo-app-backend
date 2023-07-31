"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
var error_controller_1 = require("../controllers/error.controller");
var jwt = __importStar(require("jsonwebtoken"));
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
