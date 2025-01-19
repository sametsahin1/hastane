// routes/media.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Media = require('../models/Media');

// Multer yapılandırması
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); 
  },
  filename: function (req, file, cb) {
    // Benzersiz dosya adı oluştur
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Kabul edilen dosya tipleri
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Desteklenmeyen dosya tipi'));
    }
  }
});

// Tüm medyaları listele
router.get('/', async (req, res) => {
  try {
    const medias = await Media.find().sort({ createdAt: -1 });
    res.json(medias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni medya yükle
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya yüklenemedi' });
    }

    // Dosya yolunu oluştur
    const filePath = `/uploads/${req.file.filename}`;

    // Yeni medya belgesi oluştur
    const media = new Media({
      name: req.body.name,
      mediaType: req.body.mediaType,
      filePath: filePath,
      duration: req.body.duration || 5 // Varsayılan süre 5 saniye
    });

    const savedMedia = await media.save();
    res.status(201).json(savedMedia);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Medya yüklenirken hata oluştu',
      error: error.message 
    });
  }
});

// Medya sil
router.delete('/:id', async (req, res) => {
  try {
    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: 'Medya silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
