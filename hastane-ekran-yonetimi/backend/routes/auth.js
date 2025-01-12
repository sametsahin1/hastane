// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// basit secret key
const SECRET_KEY = 'SECRET123'; 

// Register (opsiyonel)
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Kullanıcı adı zaten var' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, passwordHash });
    await newUser.save();

    return res.status(201).json({ message: 'Kullanıcı oluşturuldu' });
  } catch (err) {
    return res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Şifre hatalı' });
    }

    // JWT oluştur
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    return res.json({ message: 'Giriş başarılı', token });
  } catch (err) {
    return res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
});

module.exports = router;
