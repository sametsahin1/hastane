// routes/playlists.js
const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const Media = require('../models/Media');

// Tüm playlistleri getir
router.get('/', async (req, res) => {
    try {
        const playlists = await Playlist.find()
            .populate('medias.mediaId')
            .sort({ createdAt: -1 });
        return res.json(playlists);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Yeni playlist (döngü) oluşturma
router.post('/', async (req, res) => {
    try {
        const playlist = new Playlist({
            name: req.body.name,
            medias: req.body.medias
        });
        const savedPlaylist = await playlist.save();
        return res.status(201).json(savedPlaylist);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Playlist'e medya ekleme
router.post('/:id/addMedia', async (req, res) => {
    try {
        const { id } = req.params; // playlist id
        const { mediaId, duration } = req.body;

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist bulunamadı' });
        }
        
        // Media var mı kontrol
        const media = await Media.findById(mediaId);
        if (!media) {
            return res.status(404).json({ message: 'Medya bulunamadı' });
        }

        playlist.medias.push({ mediaId: media._id, duration });
        await playlist.save();

        // Populate edilmiş playlist'i geri dön
        const updatedPlaylist = await Playlist.findById(id).populate('medias.mediaId');
        return res.json({ message: 'Medya eklendi', playlist: updatedPlaylist });
    } catch (err) {
        return res.status(500).json({ message: 'Sunucu hatası', error: err });
    }
});

// Playlist'ten medya silme
router.delete('/:playlistId/media/:mediaIndex', async (req, res) => {
    try {
        const { playlistId, mediaIndex } = req.params;
        
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist bulunamadı' });
        }

        // Medyayı sil
        playlist.medias.splice(mediaIndex, 1);
        await playlist.save();
        
        return res.json({ message: 'Medya silindi', playlist });
    } catch (err) {
        return res.status(500).json({ message: 'Sunucu hatası', error: err });
    }
});

// Playlist silme endpoint'i
router.delete('/:id', async (req, res) => {
    try {
        await Playlist.findByIdAndDelete(req.params.id);
        res.json({ message: 'Playlist başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
