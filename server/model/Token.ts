import {model, Schema} from "mongoose";
import {IToken} from "../interfaces/token.interface";


const tokenSchema = new Schema<IToken>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
})

const Token = model<IToken>('token', tokenSchema);

export default Token;