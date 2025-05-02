const db = require('../config/db');

// Créer un utilisateur
exports.createUser = (userData, callback) => {
  const sql = `INSERT INTO users (firstname, lastname, email, password, phone, cin, role, establishment_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    userData.firstname,
    userData.lastname,
    userData.email,
    userData.password,
    userData.phone,
    userData.cin,
    userData.role,
    userData.establishment_id || null
  ];

  db.query(sql, values, callback);
};

// Récupérer un utilisateur par email
exports.getUserByEmail = (email, callback) => {
  const sql = `SELECT * FROM users WHERE email = ?`;
  db.query(sql, [email], callback);
};

// Mettre à jour le mot de passe
exports.updatePassword = (id, hashedPassword, callback) => {
  const sql = `UPDATE users SET password = ? WHERE id = ?`;
  db.query(sql, [hashedPassword, id], callback);
};