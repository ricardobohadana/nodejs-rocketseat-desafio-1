var uuid = require('uuid');

class User {
  constructor({name, username, todos}){
    if(!todos)
      todos = [];
    this.id = uuid.v4();
    this.name = name;
    this.username = username;
    this.todos = todos;
  }

  toJson(){
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      todos: this.todos
    }
  }
}


module.exports = { User }