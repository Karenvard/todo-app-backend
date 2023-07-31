import {Types} from "mongoose";

export class userDto {
    id: string | Types.ObjectId
    username: string
    email: string

    constructor(model: {_id: string | Types.ObjectId, username: string, email: string}) {
        this.id = model._id;
        this.username = model.username;
        this.email = model.email;
    }
}