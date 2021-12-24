const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! New id: ' + socket.id);
  socket.emit('updateData', tasks);

  socket.on('addTask', taskName => {
    tasks.push(taskName);
    socket.broadcast.emit('addTask', taskName);
  });

  socket.on('removeTask', id => {
    const taskToRemove = tasks.indexOf(tasks.find(task => task.id === id ));
    tasks.splice(taskToRemove, 1);
    socket.broadcast.emit('removeTask', id);
  });
});
