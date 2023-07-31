import {Schema, model} from "mongoose";

const TodoSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true},
    finished: {type: Boolean, required: true},
    color: {type: String},
    body: {type: String, required: true}
})

export const Todo = model("todo", TodoSchema);