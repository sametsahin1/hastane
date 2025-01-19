// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Environment'tan al. Yoksa varsayılan ver:
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/hastane_sistemi';

    // Artık useNewUrlParser / useUnifiedTopology 4.x ve üstü driverlarda gerekmez.  
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB bağlantısı başarılı');
  } catch (err) {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1);
  }
};

module.exports = connectDB;

