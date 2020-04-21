const express = require('express');
const socket = require('socket.io');

const app = express();

let tasks = [];
const server = app.listen(process.env.PORT || 8000, () => { console.log('Server is running...') });
const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', (removedTask) => {
    tasks = tasks.filter(task => task.id !== removedTask);
    socket.broadcast.emit('removeTask', removedTask);
    console.log(tasks);
  });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});