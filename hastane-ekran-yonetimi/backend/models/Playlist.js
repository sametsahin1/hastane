// models/Playlist.js
const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  medias: [{
    mediaId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Media',
      required: true
    },
    duration: { 
      type: Number, 
      default: 10,
      min: 1
    }
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Playlist', playlistSchema);
