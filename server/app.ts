import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import routes from './routes/index';
import errorHandler from "./middleware/errorHandler";
import {globalLimiter} from "./middleware/rateLimmiter";

dotenv.config();

const app = express();

// 1) GLOBAL MIDDLEWARES
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json());
app.use(globalLimiter)

// 2) ROUTES
app.use('/api/v1', routes);

// 3) ERROR HANDLING
app.use(errorHandler);

export default app;