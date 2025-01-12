// models/Screen.js
const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  currentPlaylist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  // diğer gerekli alanlar...
});

module.exports = mongoose.model('Screen', screenSchema);
