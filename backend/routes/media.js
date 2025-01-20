// routes/media.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Media = require('../models/Media');

// Multer yapılandırması
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/app/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      req.fileType = 'Resim';
      cb(null, true);
    } else if (file.mimetype.startsWith('video/')) {
      req.fileType = 'Video';
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

    const filePath = `/uploads/${req.file.filename}`;
    const media = new Media({
      name: req.body.name || req.file.originalname,
      mediaType: req.fileType,  // Multer'dan gelen dosya tipi
      filePath: filePath,
      duration: req.body.duration || 5
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
