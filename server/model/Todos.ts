import {model, Schema} from "mongoose";

interface ITodo {
    title: string,
    isFinished: boolean,
    reps: number,
    priority: "low" | "medium" | 'high',
    createdAt: Date
}


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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Todo = model<ITodo>('todos', todoSchema);

export default Todo;
