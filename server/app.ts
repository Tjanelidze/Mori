import express from 'express';
import dotenv from 'dotenv';
import {Server} from "node:http";

import routes from './routes/index.js';
import shutdown from "./utils/shutdown";
import errorHandler from "middleware/errorHandler";
import connectToDb from "db/connection.js";


dotenv.config();


const app = express();
const port = process.env.PORT;
let server: Server;

app.use(express.json());

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