const Todo = require('../model/Todos');
const {PAGINATION_DEFAULTS} = require("./constants/constants");
const AppError = require("../utils/appError");

const getAllTodos = async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || PAGINATION_DEFAULTS.DEFAULT_PAGE);
    const limit = Math.max(1, parseInt(req.query.limit) || PAGINATION_DEFAULTS.DEFAULT_LIMIT);
    const startIndex = (page - 1) * limit;

    const todos = await Todo.find().lean().skip(startIndex).limit(Math.min(limit, PAGINATION_DEFAULTS.MAX_LIMIT));

    res.status(200).json({
        status: 'success',
        results: todos.length,
        data: {
            todos,
        },
    });
};

const createTodo = async (req, res) => {
    const newTodo = await Todo.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            todo: newTodo,
        },
    });

};

const getTodo = async (req, res, next) => {

    const id = req.params.id;
    const todo = await Todo.findById(id);

    if (!todo) {
        return next(new AppError('No todo found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            todo,
        },
    });

};

const updateTodo = async (req, res) => {
    const id = req.params.id;
    const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!updatedTodo) {
        return next(new AppError('No todo found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            todo: updatedTodo,
        },
    });
};

const deleteTodo = async (req, res) => {

    const id = req.params.id;
    const todo = await Todo.findById(id);

    if (!todo) {
        return next(new AppError('No todo found with that ID', 404));
    }

    await Todo.findByIdAndDelete(id);

    res.status(204).json({
        status: 'success',
        data: null,
    });

};

module.exports = {getAllTodos, createTodo, updateTodo, deleteTodo, getTodo};
