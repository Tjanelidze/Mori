const express = require('express');
const router = express.Router();

const todosRoutes = require('./todosRoutes');

router.use('/todos', todosRoutes);

module.exports = router;
