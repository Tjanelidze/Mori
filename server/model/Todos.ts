import {model, Schema} from "mongoose";
import {ITodo} from "../interfaces/todo.interface";

const todoSchema = new Schema<ITodo>({
    title: {
        type: String,
        required: [true, 'A todo must have a title'],
        trim: true,
    },
    isFinished: {
        type: Boolean,
        default: false,
    },
    reps: {
        type: Number,
        min: [1, "Repetitions cannot be less than 1"],
        default: 1,
    },
    priority: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high'],
            message: 'Priority must be low, medium, or high',
        },
        default: 'low'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'A todo must belong to a user']
    }
}, {timestamps: true});

const Todo = model<ITodo>('todos', todoSchema);

export default Todo;
