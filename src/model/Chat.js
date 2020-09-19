const mongoose = require('mongoose');

const { Schema } = mongoose;

const chatSchema = new Schema({
  lastActivity: Date,
  subscribers: [String],
  messages: [{
    username: { type: String, lowercase: true, trim: true },
    body: String,
    date: Date
  }]
});

module.exports = mongoose.model('Chat', chatSchema);
