const mongoose = require('mongoose')
const mongooseAutoInc = require('mongoose-auto-increment');
const { Schema } = mongoose;


//star 기능
const starSchema = new Schema({
  giver_id: {
    type: Number,
    required: true,
    ref: 'User'
  },
  receiver_id:{
    type: Number,
    required: true,
    ref: 'User'
  },
});

starSchema.plugin(mongooseAutoInc.plugin, 'Star');
module.exports = mongoose.model('Star', starSchema);