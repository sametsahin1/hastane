// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// MongoDB'ye bağlan
connectDB();

// middleware
app.use(bodyParser.json());
app.use(cors());

// uploads klasörünü oluştur (eğer yoksa)
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}
// uploads klasörünü statik olarak serve et
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

console.log('Uploads tam yolu:', path.join(__dirname, '../uploads'));
// Rota dosyaları
const authRoutes = require('./routes/auth');
const mediaRoutes = require('./routes/media');
const playlistRoutes = require('./routes/playlists');
const screenRoutes = require('./routes/screens');
const assignmentRoutes = require('./routes/assignments');

app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/screens', screenRoutes);
app.use('/api/assignments', assignmentRoutes);

// Basit test
app.get('/', (req, res) => {
  res.send('Hastane Ekran Sistemi API çalışıyor');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
