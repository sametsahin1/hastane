// models/Screen.js
const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  screenName: { 
    type: String, 
    required: true,
    trim: true // Boşlukları temizler
  },
  location: { 
    type: String,
    trim: true
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  currentPlaylist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }
});

module.exports = mongoose.model('Screen', screenSchema);
