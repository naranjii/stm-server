const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, senha } = req.body;
    const usuario = await User.findOne({ username });
    if (!usuario || !(await usuario.validarSenha(senha))) {
      return res.status(401).json({ error: 'User/password not found' });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'login error?' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const {username, senha } = req.body;
    if (!username || !senha) {
      return res.status(400).json({ error: 'fill username and password' });
    }
    const usuario = new User({username, senha });
    await usuario.save();
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token });
  }
   catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;
