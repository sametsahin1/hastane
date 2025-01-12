// models/Media.js
const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true }, // kullanıcıdan aldığımız isim
  filePath: { type: String, required: true }, // sunucudaki dosya yolu
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Media', mediaSchema);
