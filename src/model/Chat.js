const mongoose = require('mongoose');

const { Schema } = mongoose;

const chatSchema = new Schema({
  lastActivity: Date,
  subscribers: [String],
  messages: [{
    username: String,
    body: String,
    date: String
  }]
});

module.exports = mongoose.model('Chat', chatSchema);
