// routes/screens.js
const express = require('express');
const router = express.Router();
const Screen = require('../models/Screen');
const Playlist = require('../models/Playlist');
const Media = require('../models/Media');

// Tüm ekranları getir
router.get('/', async (req, res) => {
  try {
    const screens = await Screen.find().select('_id screenName location isActive');
    // Response'u logla
    console.log('Sending screens:', screens);
    return res.json(screens);
  } catch (err) {
    console.error('Error fetching screens:', err);
    return res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

// Ekran konfigürasyonunu getir
router.get('/:id/config', async (req, res) => {
    try {
        console.log('Config isteği alındı, Screen ID:', req.params.id);

        // Önce ekranı bul ve detaylı log al
        const rawScreen = await Screen.findById(req.params.id);
        console.log('Ham ekran verisi:', rawScreen);

        // Populate işlemi ile ekranı getir
        const screen = await Screen.findById(req.params.id)
            .populate({
                path: 'currentPlaylist',
                populate: {
                    path: 'medias.mediaId',
                    model: 'Media'
                }
            });

        console.log('Populate edilmiş ekran:', JSON.stringify(screen, null, 2));

        if (!screen) {
            console.log('Ekran bulunamadı');
            return res.status(404).json({ message: 'Ekran bulunamadı' });
        }

        // currentPlaylist kontrolü
        console.log('Current Playlist:', screen.currentPlaylist);
        
        if (!screen.currentPlaylist) {
            console.log('Playlist atanmamış. Mevcut playlist ID:', screen.currentPlaylist);
            return res.json({
                id: screen._id,
                name: screen.screenName,
                playlist: null,
                message: 'Bu ekrana henüz playlist atanmamış. Lütfen bir playlist atayın.'
            });
        }

        // Playlist'in medias kontrolü
        if (!screen.currentPlaylist.medias || screen.currentPlaylist.medias.length === 0) {
            console.log('Playlist boş. Medias:', screen.currentPlaylist.medias);
            return res.json({
                id: screen._id,
                name: screen.screenName,
                playlist: {
                    id: screen.currentPlaylist._id,
                    name: screen.currentPlaylist.name,
                    mediaItems: []
                },
                message: 'Playlist boş. Lütfen playlist\'e medya ekleyin.'
            });
        }

        // Medias detaylarını logla
        console.log('Medias:', JSON.stringify(screen.currentPlaylist.medias, null, 2));

        const config = {
            id: screen._id,
            name: screen.screenName,
            playlist: screen.currentPlaylist ? {
                id: screen.currentPlaylist._id,
                name: screen.currentPlaylist.name,
                mediaItems: screen.currentPlaylist.medias.map(item => ({
                    id: item.mediaId._id,
                    mediaType: item.mediaId.mediaType,
                    filePath: `http://localhost:3000/uploads/${item.mediaId.filePath}`,
                    duration: item.duration
                }))
            } : null
        };

        console.log('Gönderilen config:', JSON.stringify(config, null, 2));
        return res.json(config);
    } catch (err) {
        console.error('Hata:', err);
        return res.status(500).json({ 
            message: 'Sunucu hatası', 
            error: err.message,
            stack: err.stack 
        });
    }
});

// Ekrana playlist atama endpoint'i
router.put('/:id/playlist', async (req, res) => {
    try {
        const { playlistId } = req.body;
        console.log('Playlist atama isteği:', { screenId: req.params.id, playlistId });

        const screen = await Screen.findById(req.params.id);
        if (!screen) {
            return res.status(404).json({ message: 'Ekran bulunamadı' });
        }

        // Playlist'in varlığını kontrol et
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist bulunamadı' });
        }

        screen.currentPlaylist = playlistId;
        await screen.save();

        console.log('Playlist başarıyla atandı:', { 
            screenId: screen._id, 
            playlistId: screen.currentPlaylist 
        });

        // Güncellenmiş ekranı populate ederek dön
        const updatedScreen = await Screen.findById(req.params.id)
            .populate('currentPlaylist');

        res.json(updatedScreen);
    } catch (err) {
        console.error('Playlist atama hatası:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
