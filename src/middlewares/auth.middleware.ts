import type {NextFunction, Request, Response} from "express";
import {errorController} from "../controllers/error.controller";
import * as jwt from "jsonwebtoken";
import type {JwtPayload} from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = (req.headers["authorization"] as string).split(" ")[1];
        if (!token) return errorController(res,"unauthorized", "auth", "Error. Please sign in.");
        const user = jwt.verify(token, process.env.SECRET_KEY as string);
        (req as Request & {user: JwtPayload | string}).user = user;
        next();
    } catch (e: any) {
        if (e instanceof jwt.TokenExpiredError) {
            return errorController(res, "unauthorized", "auth-expired", "Session is expired. Please sign in.")
        }
        console.log(e.message);
        return errorController(res, "unauthorized", "auth", "Server error. Please try to sign in.")
    }
}