const express = require('express');
const mongoose = require('mongoose');
const todoRouter = express.Router();
const todoSchema = require('./../schemas/todoSchema');
const userSchema = require('./../schemas/userSchema');
const checkLogin = require('./../midlewares/checkLogin');

const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);

// Get all the TODO
todoRouter.get('/', checkLogin, (req, res)=> {
  Todo.find({})
  .populate("user", "name username")
  .select({
    _id:0,
    __v:0
  })
  .exec((err, data)=>{
    if(err){
      res.status(500).json({
        error: "There was a server side error"
      })
    } else {
      res.status(200).json({
        result: data,
        message: "successfully fetch data"
      })
    }
  })
})

// Get all active todo || instance methods
todoRouter.get('/active', async(req, res)=>{
  try{
    const todo = new Todo();
    const data = await todo.findActive();
    res.status(200).json({
      message: "Data received successfully"
    })
  }catch(err){
    res.status(500).json({
      error: "There was a server side error"
    })
  }
});

// Get all active todo || instance methods || callback
todoRouter.get('/active-callback', (req, res)=> {
  const todo = new Todo();
  const data = todo.findActiveCallback((err, data)=> {
    console.log(data)
    if(err){
      res.status(500).json({
        error: "There has a server side error"
      })
    } else{
      res.status(200).json({
        message: "data showed by callback successfully"
      })
    }
  });
})

todoRouter.get('/find-by-name', async(req, res)=> {
  const data = await Todo.findByName();
  res.status(200).json({
    data,
    message: "data found"
  })
})

// Get A TODO
todoRouter.get('/:id', (req, res)=> {
   Todo.find({_id: req.params.id}, (err, data)=>{
    if(err){
      res.status(500).json({
        error: "There has a server side error"
      })
    } else{
      res.status(200).json({
        result: data,
        message: "data find successfully"
      })
    }
  })
})

// Post A the TODO
todoRouter.post('/', checkLogin, async (req, res)=> {
  const newTodo = new Todo({...req.body, user: req.id});
  try {
    const todo = await newTodo.save();
    await User.updateOne({
      _id: req.id
    }, {
      $push: {
        todos: todo._id
      }
    })

    res.status(500).json({
      data : todo,
      message: "Todo was successfully added!"
    })
  }catch {
    res.status(200).json({
      error: "There was a server side error!"
    })
  }
})

// Post multiple TODO
todoRouter.post('/all', (req, res)=> {
   Todo.insertMany(req.body, (err) => {
    if(err){
      res.status(500).json({
        error: "There was a server side error!"
      })
    } else{
      res.status(200).json({
        message: "Todos ware successfully added!"
      })
    }
  })
})

// Put / Edit TODO
todoRouter.put('/:id', (req, res)=> {
   Todo.updateOne({_id: req.params.id}, {
    $set: {
      status: "actives"
    }
  }, (err) => {
    if(err){
      res.status(500).json({
        error: "There was a server side error"
      })
    } else{
      res.status(200).json({
        message: "Data added successfully"
      })
    }
  })
})

// Delete TODO
todoRouter.delete('/:id', (req, res)=> {
   Todo.deleteOne({_id: req.params.id}, (err, data)=>{
    if(err){
      res.status(500).json({
        error: "There was a server side error"
      })
    } else{
      res.status(200).json({
        data: data,
        message: "data removed successfully"
      })
    }
  })
})

module.exports = todoRouter;