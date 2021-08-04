const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userRouter = express.Router();
const userSchema = require('../schemas/userSchema');

const User = mongoose.model('user', userSchema);

// Register
userRouter.post('/signup', async (req, res)=> {
  try{
    const hasPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hasPassword,
    });
    await newUser.save();
    res.status(200).json({
      message: "signup was successfully"
    })
  } catch(err){
    res.send(500).json({
      error: "Signup Failed"
    })
  }
});

// Login
userRouter.post('/signing', async(req, res) => {
  try{
    const user = await User.find( {name: req.body.name} );
    console.log(user)
    if(user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);

      if(isValidPassword) {
        const token = jwt.sign({
          name: user[0].name,
          id: user[0]._id,
        }, process.env.JWT_SECRET, {
          expiresIn: "1h"
        })

        res.status(200).json({
          "access_token": token,
          "Message": "Login successful"
        })
      }

    } else{
      res.status(401).json({
        "error": "Authentication Failed"
      });
    }
  }catch {
    res.status(401).json({
      "error": "Authentication Failed"
    });
  }
})

// Get All users
userRouter.get('/all', async (req, res) => {
  try{
    const users = await User.find({})
    .populate('todos');
    res.status(500).json({
      data: users,
      message: "Data fetch successfully"
    })
  }catch(err){
    res.status(500).json({
      error: err
    })
  }
})


module.exports = userRouter;