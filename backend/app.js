const express = require('express');
const cors = require('cors');
const app = express();
const playlistRoutes = require('./routes/playlists');
const mediaRoutes = require('./routes/media');
const authRoutes = require('./routes/auth');

// CORS ayarları
app.use(cors({
    origin: '*', // Tüm originlere izin ver
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('uploads')); // Medya dosyalarına erişim için 

app.use('/playlists', playlistRoutes); 
app.use('/api', mediaRoutes); 
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Bir şeyler ters gitti!' });
});

module.exports = app; 