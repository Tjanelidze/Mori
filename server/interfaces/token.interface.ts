import {Schema} from "mongoose";

export interface IToken {
    token: string,
    userId: Schema.Types.ObjectId,
    createdAt: Date,
}
