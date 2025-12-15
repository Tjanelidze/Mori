require('dotenv').config();
const express = require('express');
const routes = require('./routes');

const { connectToDb } = require('./db/connection');

const app = express();
const port = process.env.PORT;

app.use('/api', routes);

connectToDb().then(() => {
  app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
  });
});
