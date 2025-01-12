// routes/media.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Media = require('../models/Media');

// Uploads klasörünü oluştur
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer konfigürasyonu
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Upload endpoint'i
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Dosya yüklenemedi' });
        }

        const media = new Media({
            title: req.body.title,
            mediaType: req.body.mediaType,
            filePath: req.file.filename
        });

        await media.save();
        res.status(201).json(media);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Medya listeleme
router.get('/', async (req, res) => {
    try {
        const media = await Media.find();
        res.json(media);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Medya silme
router.delete('/:id', async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) {
            return res.status(404).json({ message: 'Medya bulunamadı' });
        }

        // Dosyayı fiziksel olarak sil
        const filePath = path.join(uploadDir, media.filePath);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Media.deleteOne({ _id: req.params.id });
        res.json({ message: 'Medya silindi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
