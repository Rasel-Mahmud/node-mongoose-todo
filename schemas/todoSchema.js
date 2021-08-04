const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['active', 'inactive']
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user"
  }
});

// Mongoose Methods

// todoSchema.methods = {
//   findActive : function(){
//     return mongoose.model('Todo').find({status: 'inactive'})
//   }
// }

todoSchema.methods.findActive = function(){
  return mongoose.model('Todo').find({status: 'inactive'})
}

todoSchema.methods = {
  findActiveCallback: function(cb){
    return mongoose.model('Todo').find({status: 'active'}, cb)
  }
}

// Mongoose statics
todoSchema.statics = {
  findByName: function(){
    return this.find({ title: /js/i })
  }
}

module.exports = todoSchema;