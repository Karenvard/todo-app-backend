"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = void 0;
var mongoose_1 = require("mongoose");
var TodoSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    finished: { type: Boolean, required: true },
    color: { type: String },
    body: { type: String, required: true }
});
exports.Todo = (0, mongoose_1.model)("todo", TodoSchema);
