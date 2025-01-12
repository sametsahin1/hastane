// routes/assignments.js
const express = require('express');
const router = express.Router();
const ScreenPlaylists = require('../models/ScreenPlaylists');
const Screen = require('../models/Screen');
const Playlist = require('../models/Playlist');

// Tüm atamaları listele (opsiyonel)
router.get('/', async (req, res) => {
  try {
    const allAssignments = await ScreenPlaylists.find({})
      .populate('screenId')
      .populate('playlistId');
    return res.json(allAssignments);
  } catch (err) {
    return res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
});

// Döngüyü ekranlara atama
router.post('/', async (req, res) => {
  try {
    const { playlistId, screenIds } = req.body;
    // screenIds -> [ "id1", "id2", "id3" ]

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist yok' });
    }

    // Ekranlar var mı kontrol?
    const screens = await Screen.find({ _id: { $in: screenIds } });
    if (!screens || screens.length === 0) {
      return res.status(404).json({ message: 'Ekran bulunamadı' });
    }

    // Her ekran için atama kaydı oluştur
    const assignments = [];
    for (const sid of screenIds) {
      assignments.push({
        screenId: sid,
        playlistId: playlistId,
        isActive: true
      });
    }
    const inserted = await ScreenPlaylists.insertMany(assignments);

    return res.status(201).json({ message: 'Atama başarıyla yapıldı', data: inserted });
  } catch (err) {
    return res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
});

module.exports = router;
