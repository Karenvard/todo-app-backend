"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var auth_middleware_1 = require("./middlewares/auth.middleware");
var auth_controller_1 = require("./controllers/auth.controller");
var express_validator_1 = require("express-validator");
exports.router = (0, express_1.Router)();
exports.router.post("/signup", [
    (0, express_validator_1.check)("username", "Username field can not be empty").notEmpty(),
    (0, express_validator_1.check)("username", "Username must contain not less than 4 characters").isLength({ min: 4 }),
    (0, express_validator_1.check)("username", "Username must contain up to 13 characters").isLength({ max: 13 }),
    (0, express_validator_1.check)("email", "Email field can not be empty").notEmpty(),
    (0, express_validator_1.check)("email", "Email field value is not valid email").isEmail(),
    (0, express_validator_1.check)("password", "Password field can not be empty").notEmpty(),
    (0, express_validator_1.check)("password", "Password must contain not less than 8 characters").isLength({ min: 8 }),
    (0, express_validator_1.check)("password", "Password must contain up to 25 characters").isLength({ max: 25 })
], auth_controller_1.authController.signup);
exports.router.post("/signin", auth_controller_1.authController.signin);
exports.router.get("/user", auth_middleware_1.authMiddleware, auth_controller_1.authController.getUser);
exports.router.get("/todos", auth_middleware_1.authMiddleware, auth_controller_1.authController.getTodos);
exports.router.post("/todos", auth_middleware_1.authMiddleware, [
    (0, express_validator_1.check)("body", "Task text can not be empty").notEmpty(),
    (0, express_validator_1.check)("body", "Task text must contains less than 50 characters").isLength({ max: 50 }),
    (0, express_validator_1.check)("color", "Task color must be type hex color.").isHexColor()
], auth_controller_1.authController.addTodo);
exports.router.put("/todos/:id", [
    (0, express_validator_1.check)("body", "Task text can not be empty").notEmpty(),
    (0, express_validator_1.check)("body", "Task text must contains less than 75 characters").isLength({ max: 75 }),
    (0, express_validator_1.check)("color", "Task color must be type hex color.").isHexColor(),
    (0, express_validator_1.check)("finished", "Task finished value should be type boolean").isBoolean()
], auth_middleware_1.authMiddleware, auth_controller_1.authController.changeTodo);
exports.router.delete("/todos/:id", auth_middleware_1.authMiddleware, auth_controller_1.authController.deleteTodo);
