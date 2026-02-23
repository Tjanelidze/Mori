import express from "express";

import catchAsync from "../utils/catchAsync.js";
import * as todoController from "../controllers/todoController";

const router = express.Router();


router.get('/', catchAsync(todoController.getAllTodos));
router.post('/', catchAsync(todoController.createTodo));
router.get('/:id', catchAsync(todoController.getTodo));
router.patch('/:id', catchAsync(todoController.updateTodo));
router.delete('/:id', catchAsync(todoController.deleteTodo));

export default router;
