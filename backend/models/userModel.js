const bcrypt = require('bcrypt');
const db = require('../config/db');

const User = {
  create: (userData, callback) => {
    // Hachage du mot de passe avant de le stocker
    bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
      if (err) return callback(err);

      // Vérifie si le téléphone est vide ou non fourni, le rend NULL
      const phone = userData.phone || null;
      // Vérifie si le CIN est vide, le rend NULL
      const cin = userData.cin || null;

      const sql = 'INSERT INTO users (firstname, lastname, email, password, role, phone, cin, establishment_id) VALUES (?, ?, ?, ?, ?, ?, ?,?)';
      db.query(sql, [userData.firstname, userData.lastname, userData.email, hashedPassword, userData.role, phone, cin, userData.establishment_id], callback);
    });
  },

  update: (id, userData, callback) => {
    // Hachage du mot de passe avant la mise à jour
    if (userData.password) {
      bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
        if (err) return callback(err);

        const sql = 'UPDATE users SET first_name = ?, name = ?, email = ?, password = ?, role = ?, phone = ?,establishment_id = ? , cin = ? WHERE id = ?';
        db.query(sql, [userData.first_name, userData.name, userData.email, hashedPassword, userData.role, userData.phone, userData.cin, userData.establishment_id,, id], callback);
      });
    } else {
      const sql = 'UPDATE users SET first_name = ?, name = ?, email = ?, role = ?, phone = ?,establishment_id = ? , cin = ? WHERE id = ?';
      db.query(sql, [userData.first_name, userData.name, userData.email, userData.role, userData.phone, userData.cin, userData.establishment_id,, id], callback);
    }
  },

  delete: (id, callback) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], callback);
  },

  getAll: (callback) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, callback);
  },
  getAllByEstablishmentId: (establishment_id, callback) => {
    const sql = 'SELECT * FROM users WHERE establishment_id = ?';
    db.query(sql, [establishment_id], callback);
  },

  getById: (id, callback) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], callback);
  },

  updateProfile: (id, userData, callback) => {
    // Hachage du mot de passe avant la mise à jour
    if (userData.password) {
      bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
        if (err) return callback(err);

        const sql = 'UPDATE users SET firstname = ?, lastname = ?, email = ?, password = ?, phone = ?, cin = ? WHERE id = ?';
        db.query(sql, [userData.firstname, userData.lastname, userData.email, hashedPassword, userData.phone, userData.cin, id], callback);
      });
    } else {
      const sql = 'UPDATE users SET firstname = ?, lastname = ?, email = ?, phone = ?, cin = ? WHERE id = ?';
      db.query(sql, [userData.firstname, userData.lastname, userData.email, userData.phone, userData.cin, id], callback);
    }
  },
};

module.exports = User;
