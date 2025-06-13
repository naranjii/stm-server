const jwt = require('jsonwebtoken');
const User = require('../models/User');

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    // Verifica se o usuário ainda existe
    const usuario = await User.findById(user.id);
    if (!usuario) return res.status(401).json({ error: 'Usuário não existe' });
    req.user = usuario;
    next();
  });
}

module.exports = { authenticateToken };
