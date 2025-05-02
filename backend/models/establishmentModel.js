const db = require('../config/db');

// Méthode pour récupérer tous les établissements
const getAllEstablishments = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM establishments', (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

// Méthode pour récupérer un établissement par ID
const getById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM establishments WHERE id = ?', [id], (err, results) => {
            if (err) reject(err);
            resolve(results[0]);
        });
    });
};

// Méthode pour ajouter un établissement
const createEstablishment = (data) => {
    return new Promise((resolve, reject) => {
        const { name, address, phone, email } = data;
        db.query(
            'INSERT INTO establishments (name, address, phone, email) VALUES (?, ?, ?, ?)',
            [name, address, phone, email],
            (err, results) => {
                if (err) reject(err);
                resolve(results);
            }
        );
    });
};

const updateEstablishment = (id, data) => {
    return new Promise((resolve, reject) => {
        const { name, address, phone, email } = data;
        // On fait juste la mise à jour ici, pas d'insertion
        db.query(
            'UPDATE establishments SET name = ?, address = ?, phone = ?, email = ? WHERE id = ?',
            [name, address, phone, email, id],
            (err, results) => {
                if (err) reject(err);
                // Vérifie que l'enregistrement a bien été mis à jour
                if (results.affectedRows === 0) {
                    reject(new Error("Aucun établissement trouvé avec cet ID"));
                }
                resolve(results);
            }
        );
    });
};


// Méthode pour supprimer un établissement
const deleteEstablishment = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM establishments WHERE id = ?', [id], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

module.exports = { getAllEstablishments, getById, createEstablishment, updateEstablishment, deleteEstablishment };