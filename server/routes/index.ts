import express from 'express';
import todosRoutes from "./todosRoutes";
import usersRoutes from "./usersRoutes";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();


router.use('/todos', authMiddleware, todosRoutes);
router.use('/users', usersRoutes);

export default router;
