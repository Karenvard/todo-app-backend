import {Types} from "mongoose";

export class todoDto{
    body: string;
    color?: string;
    finished: boolean;
    id: string | Types.ObjectId;
    constructor(model: {_id: Types.ObjectId, finished: boolean, color?: string, body: string}) {
        this.id = model._id;
        this.finished = model.finished;
        this.color = model.color || "";
        this.body = model.body;
    }
}