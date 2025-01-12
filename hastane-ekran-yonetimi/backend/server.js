// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db');
const path = require('path');

const app = express();
const PORT = 3000;

// MongoDB'ye bağlan
connectDB();

// middleware
app.use(bodyParser.json());
app.use(cors());

// uploads klasörünü statik servis etmek isterseniz (resim/video gösterimi için):
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('Uploads tam yolu:', path.join(__dirname, '../uploads'));
// Rota dosyaları
const authRoutes = require('./routes/auth');
const mediaRoutes = require('./routes/media');
const playlistRoutes = require('./routes/playlists');
const screenRoutes = require('./routes/screens');
const assignmentRoutes = require('./routes/assignments');

app.use('/auth', authRoutes);
app.use('/media', mediaRoutes);
app.use('/playlists', playlistRoutes);
app.use('/screens', screenRoutes);
app.use('/assignments', assignmentRoutes);

// Basit test
app.get('/', (req, res) => {
  res.send('Hastane Ekran Sistemi API çalışıyor');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
