const express = require('express');

const app = express();

const port = 3000;

let todos = [
  { id: 1, task: 'Buy groceries', completed: false },
  { id: 2, task: 'Learn Node.js', completed: false },
];

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
