require('dotenv').config();
const express = require('express');
const routes = require('./routes');

const {connectToDb} = require('./db/connection');
const errorHandler = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT;
let server;

app.use(express.json());

app.use('/api/v1', routes);

app.use(errorHandler);

connectToDb().then(() => {
    server = app.listen(port, () => {
        console.log(`App listening on port: ${port}`);
    });
}).catch((err) => {
    console.error('Failed to connect to database, shutting down.', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    
    if (server) {
        const forceExit = setTimeout(() => process.exit(1), 10_000).unref();
        server.close(() => {
            clearTimeout(forceExit);
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});