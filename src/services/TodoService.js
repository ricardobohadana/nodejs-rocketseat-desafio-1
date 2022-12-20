const { Todo } = require("../models/Todo");
const {inMemoryDatabase} = require("../cache/InMemoryDatabase");

class TodoService {
  constructor(memoryDb){
    this.memoryDb = memoryDb;
  }

  createTodo(request, response){
    try {
      const {title, deadline, userId} = request.body;
      if(!title || !deadline)
        return response.status(400).json({error: "title ou deadline nao fornecidos"});

      const todo = new Todo({title, deadline, userId});

      this.memoryDb.addTodo(todo);

      return response.status(201).json(todo.toJson());
    } catch (error) {
     return response.status(404).json({error: error.message}); 
    }
  }

  getTodosByUser(request, response){
    try {
      const username = request.get("username");
      if(!username)
        return response.status(400).json({error: "Parametro username nao foi enviado!"})
      
      const todos = this.memoryDb.getTodosByUsername(username);
      const jsonTodos = todos.map(t => t.toJson());
      return response.status(200).json(jsonTodos);
      
    } catch (error) {
      return response.status(404).json({error: error.message})
    }
  }

  updateTodo(request, response){
    try {
      const {id} = request.params;
      if(!id)
        return response.status(404).json({error: "propriedade id nao fornecida"})
  
      const {title, deadline} = request.body;
      if(!title || !deadline)
        return response.status(400).json({error: "title ou deadline nao fornecidos"});
  
      const todo = this.memoryDb.updateTodo(id, title, new Date(deadline));

      return response.status(202).json(todo.toJson());
      
    } catch (error) {
      return response.status(404).json({error: error.message})
    }
  }
  
  markTodoAsDone(request, response){
    try {
      const {id} = request.params;
      if(!id)
        return response.status(404).json({error: "propriedade id nao fornecida"})

      const todo = this.memoryDb.markTodoAsDone(id);

      return response.status(202).json(todo.toJson());
    } catch (error) {
      return response.status(404).json({error: error.message})
    }
  }

  deleteTodo(request, response){
    try {
      const {id} = request.params;
      if(!id)
        return response.status(404).json({error: "propriedade id nao fornecida"})
      this.memoryDb.deleteTodo(id);

      return response.status(204).json();
    } catch (error) {
      return response.status(404).json({error: error.message})
    }
  }
}

const todoService = new TodoService(inMemoryDatabase);

module.exports = { todoService };