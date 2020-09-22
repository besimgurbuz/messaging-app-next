const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  hashPassword: String,
  blockedList: []
});

module.exports = mongoose.model('User', UserSchema);
