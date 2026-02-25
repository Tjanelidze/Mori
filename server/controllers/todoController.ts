import AppError from '../utils/AppError.js';
import {NextFunction, Request, Response} from 'express';
import {PAGINATION_DEFAULTS} from "./constants/constants.js";
import Todo from "../model/Todos.js";
import cleanQuery from "../utils/cleanQuery";

const getAllTodos = async (req: Request, res: Response): Promise<Response | void> => {
    const page = Math.max(1, parseInt(req.query.page as string) || PAGINATION_DEFAULTS.DEFAULT_PAGE);
    const limit = Math.min(
        Math.max(1, parseInt(req.query.limit as string) || PAGINATION_DEFAULTS.DEFAULT_LIMIT),
        PAGINATION_DEFAULTS.MAX_LIMIT
    );
    const startIndex = (page - 1) * limit;
    const queryObject = {
        title: req.query.title ? new RegExp(String(req.query.title), 'i') : undefined,
        priority: req.query.priority,
        isFinished: req.query.isFinished === 'true',
    }
    const query = cleanQuery(queryObject);
    const paginationLimit = Math.min(limit, PAGINATION_DEFAULTS.MAX_LIMIT);

    const [totalResults, todos] = await Promise.all([Todo.countDocuments(query), Todo.find(query)
        .lean()
        .skip(startIndex)
        .limit(paginationLimit)])

    return res.status(200).json({
        status: 'success',
        results: todos.length,
        totalResults,
        data: {
            todos,
        }
    });
};

const createTodo = async (req: Request, res: Response): Promise<Response | void> => {
    const {title, reps, priority} = req.body;
    const newTodo = await Todo.create({title, reps, priority});

    return res.status(201).json({
        status: 'success',
        data: {
            todo: newTodo,
        },
    });
};

const getTodo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    const todo = await Todo.findById(id);

    if (!todo) {
        return next(new AppError('No todo found with that ID', 404));
    }

    return res.status(200).json({
        status: 'success',
        data: {
            todo,
        },
    });
};

const updateTodo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    const {title, reps, priority} = req.body
    const updatedTodo = await Todo.findByIdAndUpdate(id, {title, reps, priority}, {
        new: true,
        runValidators: true,
    });

    if (!updatedTodo) {
        return next(new AppError('No todo found with that ID', 404));
    }

    return res.status(200).json({
        status: 'success',
        data: {
            todo: updatedTodo,
        },
    });
};

const deleteTodo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const id = req.params.id;
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
        return next(new AppError('No todo found with that ID', 404));
    }

    return res.status(204).json({
        status: 'success',
        data: null,
    });
};

export {getAllTodos, createTodo, updateTodo, deleteTodo, getTodo};
