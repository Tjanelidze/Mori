const express = require('express');
const router = express.Router();

const todoController = require('../controllers/todoController');
const catchAsync = require("../utils/catchAsync");

router.get('/', catchAsync(todoController.getAllTodos));
router.post('/', catchAsync(todoController.createTodo));
router.get('/:id', catchAsync(todoController.getTodo));
router.patch('/:id', catchAsync(todoController.updateTodo));
router.delete('/:id', catchAsync(todoController.deleteTodo));

module.exports = router;
