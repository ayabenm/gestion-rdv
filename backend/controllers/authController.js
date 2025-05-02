const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Inscription
exports.register = async (req, res) => {
  const { nom, prenom, email, mot_de_passe, telephone, cin, role } = req.body;
  const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
  
  const sql = `INSERT INTO users (nom, prenom, email, mot_de_passe, telephone, cin, role) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(sql, [nom, prenom, email, hashedPassword, telephone, cin, role], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Erreur lors de l\'inscription');
    }
    res.status(200).send('Inscription réussie');
  });
};

// Connexion
exports.login = (req, res) => {
  const { email, mot_de_passe } = req.body;
  
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: 'Utilisateur non trouvé' });
    
    const user = results[0];
    const match = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!match) return res.status(401).json({ message: 'Mot de passe incorrect' });

    // Création du token JWT
    const token = jwt.sign({ id: user.id, role: user.role }, 'SECRET_KEY', { expiresIn: '1h' });
    
    // Envoi du token et du rôle dans la réponse
    res.json({ token, role: user.role });
  });
};
