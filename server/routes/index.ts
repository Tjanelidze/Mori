import express from 'express';
import todosRoutes from "./todosRoutes.js";

const router = express.Router();


router.use('/todos', todosRoutes);

export default router;
