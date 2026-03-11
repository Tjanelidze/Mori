import {model, Schema} from "mongoose";
import {IToken} from "../interfaces/token.interface";


const tokenSchema = new Schema<IToken>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1800
    }
})

const Token = model<IToken>('token', tokenSchema);

export default Token;