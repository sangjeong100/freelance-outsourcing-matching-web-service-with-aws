const mongoose = require('mongoose')
const mongooseAutoInc = require('mongoose-auto-increment');
const { Schema } = mongoose;



//required: true -> 필수 

const postSchema = new Schema({
  writer_id: {
    type: Number,
    required: true,
    ref: 'User'
  },
  writer_name:{
    type:String,
    required: true,
  },
  post_type: {    
    type: String,
    required: true, 
    //domain - super / developer / company
  },
  title: {
    type: String,
    required: true
  },
  content: { 
    type: String,
    required: true
  },
  hit: {
    type: Number,
    default: 0
  },
  created_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  modified_date: {
    type: Date,
    default: Date.now
  }
});
postSchema.plugin(mongooseAutoInc.plugin, 'Post');
module.exports = mongoose.model('Post', postSchema);