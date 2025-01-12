const express = require('express');
const cors = require('cors');
const app = express();
const playlistRoutes = require('./routes/playlists');

// CORS ayarları
app.use(cors({
    origin: '*', // Tüm originlere izin ver
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('uploads')); // Medya dosyalarına erişim için 

app.use('/playlists', playlistRoutes); 