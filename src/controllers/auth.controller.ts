import type {RequestAuth} from "../interfaces/RequestAuth";
import {config} from "dotenv";
config();
import { ValidationError, validationResult } from "express-validator";
import type {Response} from "express";
import {TypedRequestBody} from "../interfaces/TypedRequestBody";
import {errorController} from "./error.controller";
import * as bcrypt from "bcrypt";
import {User} from "../models/user.model";
import * as jwt from "jsonwebtoken";
import {userDto} from "../dtos/user.dto";
import {Todo} from "../models/todo.model";
import {todoDto} from "../dtos/todo.dto";
import {TypedRequestAuthBody} from "../interfaces/TypedRequestAuthBody"

function generateAccessToken(id: string, username: string, rememberMe: boolean) {
    const payload = {id, username, rememberMe};
    const expiresIn: "6h" | "2h" = rememberMe ? "6h" : "2h";
    return jwt.sign(payload, process.env.SECRET_KEY as string, {expiresIn});
}

export class authController {
    static async signup(req: TypedRequestBody<{username: string, password: string, email: string}>, res: Response) {
        try {
            const {email, password, username} = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return errorController(res, "badrequest", (errors.array()[0] as ValidationError & {path: string}).path, errors.array()[0].msg);
            }
            const candidateUsername = await User.findOne({username});
            if (candidateUsername) return errorController(res, "badrequest", "username", "That username is already exists. Please try another one.");
            const candidateEmail = await User.findOne({email});
            if (candidateEmail) return errorController(res, "badrequest", "email", "That email is already exists. Please try another one.")
            const hashedPassword = bcrypt.hashSync(password, 10);
            await User.create({username, password: hashedPassword, email});
            return res.status(200).json({message: `User ${username} was created successfully.`});
        } catch (_) {
            return errorController(res, "internalservererror", "signup", "Server error. Please try sign up later.")
        }
    }

    static async signin(req: TypedRequestBody<{login: string, password: string, rememberMe: boolean}>, res: Response) {
        try {
            const {login, password, rememberMe} = req.body;
            const user = await User.findOne({username: login}) || await User.findOne({email: login});
            const incorrectLoginOrPasswordError = () => errorController(res, "badrequest", "signin-field", "Incorrect login field or password.");
            if (!user) return incorrectLoginOrPasswordError();
            if (!bcrypt.compareSync(password, user.password)) return incorrectLoginOrPasswordError();
            const token = generateAccessToken(String(user._id), user.username, rememberMe);
            return res.status(200).json({message: "You signed in succesfully!", token});
        } catch (_) {
            return errorController(res, "internalservererror", "signin", "Server error. Please try sign in later.")
        }
    }

    static async getUser(req: RequestAuth, res: Response) {
        try {
            const userData = req.user;
            const user = await User.findOne({_id: userData.id});
            return res.status(200).json({user: new userDto(user)});
        } catch (_) {
            return errorController(res,"internalservererror", "getuser", "Server error. Please try again later.")
        }
    }

    static async getTodos(req: RequestAuth, res: Response) {
        try {
            const userData = req.user;
            const { page} = req.query;
            const pageSize = 20;
            const DBTodos = await Todo.find({userId: userData.id});
            const todos = [];
            for (let i = pageSize*(Number(page)-1); i < pageSize*Number(page); i++) {
                if (DBTodos[i]) todos.push(new todoDto(DBTodos[i]));
            }
            return res.status(200).json({todos, totalCount: DBTodos.length});
        } catch (_) {
            return errorController(res, "internalservererror", "gettodos", "Server error. Please try to get todos later.")
        }
    }

    static async addTodo(req: TypedRequestAuthBody<{body: string, color?: string}>, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return errorController(res, "badrequest", (errors.array()[0] as ValidationError & {path:string}).path, errors.array()[0].msg);
            }
            const userData = req.user;
            const {body, color} = req.body;
            const newTodo = await Todo.create({userId: userData.id, finished: false, color: color || "", body});
            return res.status(200).json({newTodo: new todoDto(newTodo), message: "New todo was added successfully!"});
        } catch (_) {
            return errorController(res,"internalservererror", "addtodo", "Server error. Please try add new todo later.")
        }
    }

    static async changeTodo(req: TypedRequestAuthBody<{finished: boolean, body: string, color: string}>, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return errorController(res, "badrequest", (errors.array()[0] as ValidationError & {path:string}).type, errors.array()[0].msg);
            }
            const userData = req.user;
            const newTodoData = req.body;
            const paramId = req.params.id;
            const DBTodo = await Todo.findOne({_id: paramId, userId: userData.id});
            DBTodo.finished = newTodoData.finished;
            DBTodo.body = newTodoData.body;
            DBTodo.color = newTodoData.color;
            await DBTodo.save();
            return res.status(200).json({todo: new todoDto(DBTodo)});
        } catch (_) {
            return errorController(res, "internalservererror", "finishtodo", "Server error. Please try to finish todo later.");
        }
    }

    static async deleteTodo(req: RequestAuth, res: Response) {
        try {
            const userData = req.user;
            const paramId = req.params.id;
            await Todo.findOneAndDelete({_id: paramId, userId: userData.id});
            return res.status(200).json({message: "The todo was deleted successfully."});
        } catch (_) {
            return errorController(res, "internalservererror", "deletetodo", "Server error. Please try to delete todo later.")
        }
    }
}
