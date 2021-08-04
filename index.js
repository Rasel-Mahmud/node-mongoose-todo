const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todoHandler = require('./routerHandler/todoHandler');
const userHandler = require('./routerHandler/userHandler');

// express app initialization
const app = express();
dotenv.config();
const PORT = 3500;
app.use(express.json());

// Database connection with mongoose
mongoose.connect("mongodb://localhost/todos", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log('connected successfully'))
  .catch((err) => console.log(err));

// Application Router
app.use('/todo', todoHandler);
app.use('/user', userHandler);

// Default error handler
const errorHandler = (err, req, res, next)=> {
  if(res.headersSend){
    return next(err);
  }
  res.status(500).json({error: err})
}
app.use(errorHandler);

// Server listening
app.listen(PORT, ()=> console.log(`Server is running at ${PORT}`));