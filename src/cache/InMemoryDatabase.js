class InMemoryDatabase {
  constructor(){
    this.users = [];
    this.todos = [];
  }
  
  usernameExists(username){
    return this.users.find(user => user.username === username) !== undefined;
  }

  getUserByUsername(username){
    return this.users.find(user => user.username === username);
  }  

  getUser(userId){
    if(!this.users.some(u => u.id === userId))
      throw new Error("Nao existe um usuário com este id cadastrado!")
    return this.users.filter(user => user.id === userId)[0];
  }

  addUser(user){
    if(this.users.some(u => u.id === user.id || u.username === user.username))
      throw new Error("Ja existe um usuario cadastrado com esse id ou username!")
    this.users.push(user);
  }

  removeUser(userId){
    if(!this.users.some(u => u.id === userId))
      throw new Error("Nao existe um usuário com este id cadastrado!")
    this.users = this.users.filter(user => user.id !== userId);
  }

  getTodo(todoId){
    if(!this.todos.some(u => u.id === todo.id))
      throw new Error("Nao existe um usuário com este id cadastrado!")
    return this.todos.filter(todo => todo.id === todoId)[0];
  }

  getTodosByUsername(username){
    const userId = this.getUserByUsername(username).id;
    return this.todos.filter(todo => todo.userId === userId);
  }

  addTodo(todo){
    if(this.todos.some(u => u.id === todo.id))
      throw new Error("Ja existe um todo cadastrado com esse id!")
    this.todos.push(todo);
  }

  deleteTodo(todoId){
    if(!this.todos.some(todo => todo.id === todoId))
      throw new Error("Nao existe um todo com este id cadastrado!")
    this.todos = this.todos.filter(todo => todo.id !== todoId);
  }

  getIndexOfTodo(todoId){
    var index = -1;
    this.todos.forEach((todo, i) => {
      if(todo.id === todoId)
        index = i;
    });
    return index;
  }

  markTodoAsDone(todoId){
    this.todos[this.getIndexOfTodo(todoId)].done = true;
    return this.todos[this.getIndexOfTodo(todoId)];
  }

  updateTodo(todoId, title, deadline){
    const indexOfTodo = this.getIndexOfTodo(todoId);
    this.todos[indexOfTodo].title = title;
    this.todos[indexOfTodo].deadline = deadline;
    return this.todos[indexOfTodo];
  }
}
const inMemoryDatabase = new InMemoryDatabase();
module.exports = {inMemoryDatabase};