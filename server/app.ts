import express from 'express';
import dotenv from 'dotenv';
import {Server} from "node:http";
import {rateLimit} from 'express-rate-limit'

import routes from './routes/index.js';

import connectToDb from "db/connection.js";
import shutdown from "./utils/shutdown.js";
import errorHandler from "./middleware/errorHandler.js";


dotenv.config();


const app = express();
const port = process.env.PORT;
let server: Server;
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        status: 'fail',
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
})

app.use(express.json());
app.use(limiter)

app.use('/api/v1', routes);

app.use(errorHandler);

connectToDb().then(() => {
    server = app.listen(port, () => {
        console.log(`App listening on port: ${port}`);
    });
}).catch((err: unknown) => {
    if (err instanceof Error) {
        console.error(err.message);
    } else {
        console.error("An unexpected error occurred", err);
    }
    console.error('Failed to connect to database, shutting down.', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);

    shutdown({signal: 'unhandledRejection', server: server});
});