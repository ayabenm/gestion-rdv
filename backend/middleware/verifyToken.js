// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).json({ message: 'Token requis' });

  jwt.verify(token, 'SECRET_KEY', (err, user) => {

    if (err) return res.status(403).json({ message: 'Token invalide' });

    req.user = user;
    next();
  });
};
