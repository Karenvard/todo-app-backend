"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorController = void 0;
function errorController(res, errCode, type, message) {
    var error = { type: type, message: message };
    var code = errCode === "internalservererror" ? 500 : errCode === "badrequest" ? 400 : errCode === "unauthorized" ? 401 : 500;
    return res.status(code).json({ error: error });
}
exports.errorController = errorController;
