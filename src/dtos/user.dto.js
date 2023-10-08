"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDto = void 0;
var userDto = /** @class */ (function () {
    function userDto(model) {
        this.id = model._id;
        this.username = model.username;
        this.email = model.email;
    }
    return userDto;
}());
exports.userDto = userDto;
