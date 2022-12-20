const express = require('express');
const cors = require('cors');
const {userService} = require('./services/UserService');
const {todoService} = require('./services/todoService');

// const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

// const users = [];

function checksExistsUserAccount(request, response, next) {
  return userService.userExists(request, response, next);
}

app.post('/users', (request, response) => {
  return userService.createUser(request, response);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  return todoService.getTodosByUser(request, response);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  return todoService.createTodo(request, response);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  return todoService.updateTodo(request, response);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  return todoService.markTodoAsDone(request, response);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  return todoService.deleteTodo(request, response);
});

module.exports = app;