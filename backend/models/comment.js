const mongoose = require('mongoose')
const mongooseAutoInc = require('mongoose-auto-increment');
const { Schema } = mongoose;

const commentSchema = new Schema({
  user_id: {
    type: Number,
    required: true,
    ref: 'User'
  },
  post_id:{
    type: Number,
    required: true,
    ref: 'Post'
  },
  content:{
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  modified_date: {
    type: Date,
    default: Date.now
  }
});

commentSchema.plugin(mongooseAutoInc.plugin, 'Comment');
module.exports = mongoose.model('Comment', commentSchema);