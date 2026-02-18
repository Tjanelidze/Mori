require('dotenv').config();
const express = require('express');
const routes = require('./routes');

const {connectToDb} = require('./db/connection');
const errorHandler = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/api/v1', routes);

app.use(errorHandler);

connectToDb().then(() => {
    app.listen(port, () => {
        console.log(`App listening on port: ${port}`);
    });
});
