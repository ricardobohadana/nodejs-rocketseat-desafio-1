const { User } = require("../models/User");
const {inMemoryDatabase} = require("../cache/InMemoryDatabase");

class UserService {
  constructor (memoryDb){
    this.memoryDb = memoryDb;
  }

  userExists(request, response, next){
    const username = request.get('username');
    if(!username)
      response.status(400).json({error: "Nome de usuário não fornecido!"})
    if(this.memoryDb.usernameExists(username)){
      request.body = {
        ...request.body,
        userId: this.memoryDb.getUserByUsername(username).id
      }
      return next();
    }
    
    return response.status(404).json({error: "Usuario nao existe!"})
  }

  createUser(request, response){
    try {
      if(!request.body)
        return response.status(400).json({error: "Parametros ausentes ou incorretos"});
      
      const {name, username} = request.body;
  
      if(!name || !username)
        return response.status(400).json({error: "Parametros ausentes ou incorretos"});
  
      if(typeof name != 'string' && typeof username != "string")
        return response.status(400).json({error: "Parametros ausentes ou incorretos"});
  
      const user = new User({name, username});
      this.memoryDb.addUser(user);
      return response.status(201).json(user.toJson());
      
    } catch (error) {
      return response.status(400).json({error: error.message});
    }
  }
}

const userService = new UserService(inMemoryDatabase);

module.exports = { userService };