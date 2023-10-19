"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoDto = void 0;
var todoDto = /** @class */ (function () {
    function todoDto(model) {
        this.id = model._id;
        this.finished = model.finished;
        this.color = model.color || "";
        this.body = model.body;
    }
    return todoDto;
}());
exports.todoDto = todoDto;
