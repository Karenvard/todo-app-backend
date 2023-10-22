"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
var express_validator_1 = require("express-validator");
var error_controller_1 = require("./error.controller");
var bcrypt = require("bcrypt");
var user_model_1 = require("../models/user.model");
var jwt = require("jsonwebtoken");
var user_dto_1 = require("../dtos/user.dto");
var todo_model_1 = require("../models/todo.model");
var todo_dto_1 = require("../dtos/todo.dto");
function generateAccessToken(id, username, rememberMe) {
    var payload = { id: id, username: username, rememberMe: rememberMe };
    var expiresIn = rememberMe ? "6h" : "2h";
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: expiresIn });
}
var authController = /** @class */ (function () {
    function authController() {
    }
    authController.signup = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, username, errors, candidateUsername, candidateEmail, hashedPassword, _1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = req.body, email = _a.email, password = _a.password, username = _a.username;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, (0, error_controller_1.errorController)(res, "badrequest", errors.array()[0].path, errors.array()[0].msg)];
                        }
                        return [4 /*yield*/, user_model_1.User.findOne({ username: username })];
                    case 1:
                        candidateUsername = _b.sent();
                        if (candidateUsername)
                            return [2 /*return*/, (0, error_controller_1.errorController)(res, "badrequest", "username", "That username is already exists. Please try another one.")];
                        return [4 /*yield*/, user_model_1.User.findOne({ email: email })];
                    case 2:
                        candidateEmail = _b.sent();
                        if (candidateEmail)
                            return [2 /*return*/, (0, error_controller_1.errorController)(res, "badrequest", "email", "That email is already exists. Please try another one.")];
                        hashedPassword = bcrypt.hashSync(password, 10);
                        return [4 /*yield*/, user_model_1.User.create({ username: username, password: hashedPassword, email: email })];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({ message: "User ".concat(username, " was created successfully.") })];
                    case 4:
                        _1 = _b.sent();
                        return [2 /*return*/, (0, error_controller_1.errorController)(res, "internalservererror", "signup", "Server error. Please try sign up later.")];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    authController.signin = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, login, password, rememberMe, user, _b, incorrectLoginOrPasswordError, token, _2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        _a = req.body, login = _a.login, password = _a.password, rememberMe = _a.rememberMe;
                        return [4 /*yield*/, user_model_1.User.findOne({ username: login })];
                    case 1:
                        _b = (_c.sent());
                        if (_b) return [3 /*break*/, 3];
                        return [4 /*yield*/, user_model_1.User.findOne({ email: login })];
                    case 2:
                        _b = (_c.sent());
                        _c.label = 3;
                    case 3:
                        user = _b;
                        incorrectLoginOrPasswordError = function () { return (0, error_controller_1.errorController)(res, "badrequest", "signin-field", "Incorrect login field or password."); };
                        if (!user)
                            return [2 /*return*/, incorrectLoginOrPasswordError()];
                        if (!bcrypt.compareSync(password, user.password))
                            return [2 /*return*/, incorrectLoginOrPasswordError()];
                        token = generateAccessToken(String(user._id), user.username, rememberMe);
                        return [2 /*return*/, res.status(200).json({ message: "You signed in succesfully!", token: token })];
                    case 4:
                        _2 = _c.sent();
                        return [2 /*return*/, (0, error_controller_1.errorController)(res, "internalservererror", "signin", "Server error. Please try sign in later.")];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    authController.getUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, user, _3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userData = req.user;
                        return [4 /*yield*/, user_model_1.User.findOne({ _id: userData.id })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, res.status(200).json({ user: new user_dto_1.userDto(user) })];
                    case 2:
                        _3 = _a.sent();
                        return [2 /*return*/, (0, error_controller_1.errorController)(res, "internalservererror", "getuser", "Server error. Please try again later.")];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    authController.getTodos = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, page, pageSize, DBTodos, todos, i, _4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userData = req.user;
                        page = req.query.page;
                        pageSize = 20;
                        return [4 /*yield*/, todo_model_1.Todo.find({ userId: userData.id })];
                    case 1:
                        DBTodos = _a.sent();
                        todos = [];
                        for (i = pageSize * (Number(page) - 1); i < pageSize * Number(page); i++) {
                            if (DBTodos[i])
                                todos.push(new todo_dto_1.todoDto(DBTodos[i]));
                        }
                        return [2 /*return*/, res.status(200).json({ todos: todos, totalCount: DBTodos.length })];
                    case 2:
                        _4 = _a.sent();
                        return [2 /*return*/, (0, error_controller_1.errorController)(res, "internalservererror", "gettodos", "Server error. Please try to get todos later.")];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    authController.addTodo = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, userData, _a, body, color, newTodo, _5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, (0, error_controller_1.errorController)(res, "badrequest", errors.array()[0].path, errors.array()[0].msg)];
                        }
                        userData = req.user;
                        _a = req.body, body = _a.body, color = _a.color;
                        return [4 /*yield*/, todo_model_1.Todo.create({ userId: userData.id, finished: false, color: color || "", body: body })];
                    case 1:
                        newTodo = _b.sent();
                        return [2 /*return*/, res.status(200).json({ newTodo: new todo_dto_1.todoDto(newTodo), message: "New todo was added successfully!" })];
                    case 2:
                        _5 = _b.sent();
                        return [2 /*return*/, (0, error_controller_1.errorController)(res, "internalservererror", "addtodo", "Server error. Please try add new todo later.")];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    authController.changeTodo = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, userData, newTodoData, paramId, DBTodo, _6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, (0, error_controller_1.errorController)(res, "badrequest", errors.array()[0].type, errors.array()[0].msg)];
                        }
                        userData = req.user;
                        newTodoData = req.body;
                        paramId = req.params.id;
                        return [4 /*yield*/, todo_model_1.Todo.findOne({ _id: paramId, userId: userData.id })];
                    case 1:
                        DBTodo = _a.sent();
                        DBTodo.finished = newTodoData.finished;
                        DBTodo.body = newTodoData.body;
                        DBTodo.color = newTodoData.color;
                        return [4 /*yield*/, DBTodo.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({ todo: new todo_dto_1.todoDto(DBTodo) })];
                    case 3:
                        _6 = _a.sent();
                        return [2 /*return*/, (0, error_controller_1.errorController)(res, "internalservererror", "finishtodo", "Server error. Please try to finish todo later.")];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    authController.deleteTodo = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, paramId, _7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userData = req.user;
                        paramId = req.params.id;
                        return [4 /*yield*/, todo_model_1.Todo.findOneAndDelete({ _id: paramId, userId: userData.id })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({ message: "The todo was deleted successfully." })];
                    case 2:
                        _7 = _a.sent();
                        return [2 /*return*/, (0, error_controller_1.errorController)(res, "internalservererror", "deletetodo", "Server error. Please try to delete todo later.")];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return authController;
}());
exports.authController = authController;
