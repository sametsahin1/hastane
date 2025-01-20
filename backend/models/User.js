// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'editor' }, // "admin" veya "
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
