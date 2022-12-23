const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(u => u.username === username);

  if(!user)
    return response.status(404).json({error: 'user not found'});

  request.user = user;
  return next();
}

app.post('/users', (request, response) => {
  const {username, name}  = request.body;

  if(!username || !name) return response.sendStatus(400);

  if(users.some(user => user.username === username))
    return response.status(400).json({error: 'this username already exists'});

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };
  users.push(user);
  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {todos} = request.user;
  return response.status(200).json(todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {id} = request.user; 
  const userIndex = users.findIndex(u => u.id === id);

  const {title, deadline} = request.body;
  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline,
    created_at: new Date()
  }
  users[userIndex].todos.push(todo);
  
  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {id} = request.user; 
  const userIndex = users.findIndex(u => u.id === id);
  
  const todoId = request.params.id;
  const todoIndex = users[userIndex].todos.findIndex(t => t.id === todoId);
  if(todoIndex < 0) return response.status(404).json({error: 'todo does not exist'})
  const {title, deadline} = request.body;
  users[userIndex].todos[todoIndex].title = title
  users[userIndex].todos[todoIndex].deadline = deadline

  return response.status(202).json(users[userIndex].todos[todoIndex]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {id} = request.user; 
  const userIndex = users.findIndex(u => u.id === id);
  
  const todoId = request.params.id;
  const todoIndex = users[userIndex].todos.findIndex(t => t.id === todoId);
  if(todoIndex < 0) return response.status(404).json({error: 'todo does not exist'})
  users[userIndex].todos[todoIndex].done = true;

  return response.status(202).json(users[userIndex].todos[todoIndex]);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {id} = request.user; 
  const userIndex = users.findIndex(u => u.id === id);
  
  const todoId = request.params.id;
  const todoIndex = users[userIndex].todos.findIndex(t => t.id === todoId);
  if(todoIndex < 0) return response.status(404).json({error: 'todo does not exist'})
  users[userIndex].todos.splice(todoIndex, 1);

  return response.sendStatus(204);
});

module.exports = app;