const mongoose = require('mongoose')
const mongooseAutoInc = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

//required: true -> 필수 

const userSchema = new Schema({
  login_id: {
    type: String,
    required: true, unique: true
  },
  passwd: {
    type: String,
    required: true, trim: true 
  },
  user_type: {    
    type: String,
    required: true, 
    //domain - super / developer / company
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: String
  },
  email: {
    type: String,
    required: true, unique: true
  },
  retained_star: { //보유중인 star 수
    type: Number,
    default: 0 
  },
  career: {
    type: String
  },
  telphone: {
    type: String
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  salt: {
    type: String,
    required: true
  },
  img_path:{
    type: String,
    default: 'basic_profile.png'
  }

});
userSchema.plugin(mongooseAutoInc.plugin, 'User');
module.exports = mongoose.model('User', userSchema);