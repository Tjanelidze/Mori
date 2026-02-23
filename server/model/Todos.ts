import mongoose from "mongoose";

// interface ITodo {
//   title: string,
//       isFinished: boolean,
//       reps: number,
//       priority: "low" | "medium" | 'high',
//       createdAt: Date
// }


const todoSchema = new mongoose.Schema({
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
        default: 'low'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Todo = mongoose.model('todos', todoSchema);

export default Todo;
