const express = require('express');
const cors = require('cors');
const { getRunningTasks } = require('./utils/tasks');

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/tasks', (req, res) => {
  const tasks = getRunningTasks();
  res.json(tasks);
});

app.listen(PORT, () => {
  console.log(`Server launched → http://localhost:${PORT}`);
});
