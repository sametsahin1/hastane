// models/Media.js
const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', mediaSchema);
