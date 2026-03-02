import express from 'express';
import todosRoutes from "./todosRoutes.js";
import usersRoutes from "./usersRoutes";

const router = express.Router();


router.use('/todos', todosRoutes);
router.use('/users', usersRoutes);

export default router;
