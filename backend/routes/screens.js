// routes/screens.js
const express = require('express');
const router = express.Router();
const Screen = require('../models/Screen');

// GET - Tüm ekranları listele
router.get('/', async (req, res) => {
  try {
    const screens = await Screen.find()
      .populate('currentPlaylist', 'name')
      .sort({ createdAt: -1 });
    res.json(screens);
  } catch (error) {
    console.error('Ekran listesi hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST - Yeni ekran ekle
router.post('/', async (req, res) => {
  try {
    const screen = new Screen({
      name: req.body.name,
      location: req.body.location,
      status: req.body.status || 'active'
    });

    const savedScreen = await screen.save();
    res.status(201).json(savedScreen);
  } catch (error) {
    console.error('Ekran ekleme hatası:', error);
    res.status(400).json({ message: error.message });
  }
});

// GET - Ekran konfigürasyonunu ve playlist detaylarını getir
router.get('/:screenId/config', async (req, res) => {
  try {
    const screen = await Screen.findById(req.params.screenId)
      .populate({
        path: 'currentPlaylist',
        populate: {
          path: 'medias.mediaId',
          model: 'Media'
        }
      });

    if (!screen) {
      return res.status(404).json({ message: 'Ekran bulunamadı' });
    }

    if (!screen.currentPlaylist) {
      return res.status(404).json({ message: 'Bu ekrana atanmış playlist bulunamadı' });
    }

    res.json({
      screen: {
        id: screen._id,
        name: screen.name,
        location: screen.location,
        status: screen.status
      },
      playlist: {
        id: screen.currentPlaylist._id,
        name: screen.currentPlaylist.name,
        mediaItems: screen.currentPlaylist.medias.map(item => ({
          id: item.mediaId._id,
          mediaType: item.mediaId.mediaType,
          filePath: item.mediaId.filePath,
          duration: item.duration,
          name: item.mediaId.name
        }))
      }
    });
  } catch (error) {
    console.error('Config error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Ekran silme endpoint'i
router.delete('/:id', async (req, res) => {
  try {
    const screen = await Screen.findByIdAndDelete(req.params.id);
    if (!screen) {
      return res.status(404).send({ message: 'Ekran bulunamadı' });
    }
    res.status(200).send({ message: 'Ekran başarıyla silindi' });
  } catch (error) {
    res.status(500).send({ message: 'Ekran silinirken bir hata oluştu', error });
  }
});

// PUT - Ekran güncelleme
router.put('/:id', async (req, res) => {
  try {
    const screen = await Screen.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        location: req.body.location,
        status: req.body.status,
        currentPlaylist: req.body.playlistId
      },
      { new: true }
    );

    if (!screen) {
      return res.status(404).json({ message: 'Ekran bulunamadı' });
    }

    res.json(screen);
  } catch (error) {
    console.error('Ekran güncelleme hatası:', error);
    res.status(400).json({ message: error.message });
  }
});

// Ekran detaylarını getir
router.get('/:id', async (req, res) => {
  try {
    console.log('Ekran ID:', req.params.id); // Debug için log

    const screen = await Screen.findById(req.params.id)
      .populate({
        path: 'currentPlaylist',
        populate: {
          path: 'mediaItems.media',
          model: 'Media'
        }
      });
    
    if (!screen) {
      return res.status(404).json({ message: 'Ekran bulunamadı' });
    }

    console.log('Bulunan ekran:', screen); // Debug için log
    
    res.json(screen);
  } catch (error) {
    console.error('Ekran getirme hatası:', error);
    res.status(500).json({ 
      message: 'Ekran bilgileri alınırken hata oluştu',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
