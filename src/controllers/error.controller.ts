import type {Response} from "express";

export function errorController(res: Response, errCode: "internalservererror" | "badrequest" | "unauthorized", type: string, message: string) {
    const error = {type, message};
    const code: 401 | 400 | 500 = errCode === "internalservererror" ? 500 : errCode === "badrequest" ? 400 : errCode === "unauthorized" ? 401 : 500
    return res.status(code).json({error});
}