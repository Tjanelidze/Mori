const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A todo must have a name'],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Todo = mongoose.model('todos', todoSchema);

module.exports = Todo;
