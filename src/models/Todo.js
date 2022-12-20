const uuid = require('uuid');

class Todo {
  constructor({title, deadline, userId}){
    this.id = uuid.v4();
    this.title = title;
    this.done = false;
    this.deadline = new Date(deadline);
    this.created_at = new Date();
    this.userId = userId;
  }

  toJson(){
    return {
      id: this.id,
      title: this.title,
      done: this.done,
      deadline: this.deadline.toISOString(),
      created_at: this.created_at
    }
  }
}

module.exports = {Todo}