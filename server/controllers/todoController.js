const Todo = require('../model/Todos');
const {PAGINATION_DEFAULTS} = require("./constants/constants");

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
    try {
        const newTodo = await Todo.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                todo: newTodo,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

const getTodo = async (req, res) => {
    try {
        const id = req.params.id;
        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({
                status: 'fail',
                message: 'No todo found with that ID',
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                todo,
            },
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid ID format',
            });
        }

        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

const updateTodo = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedTodo) {
            return res.status(404).json({
                status: 'fail',
                message: 'No todo found with that ID',
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                todo: updatedTodo,
            },
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid ID format',
            });
        }

        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

const deleteTodo = async (req, res) => {
    try {
        const id = req.params.id;
        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({
                status: 'fail',
                message: 'No todo found with that ID',
            });
        }

        await Todo.findByIdAndDelete(id);

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid ID format',
            });
        }

        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

module.exports = {getAllTodos, createTodo, updateTodo, deleteTodo, getTodo};
