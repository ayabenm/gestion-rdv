const db = require('../config/db');

// Récupérer tous les départements
const getAll = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM departements', (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

// Récupérer les départements d’un établissement
const getById = (departementId) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM departements WHERE id = ?',
            [departementId],
            (err, results) => {
                if (err) reject(err);
                resolve(results);
            }
        );
    });
};

// Récupérer les départements d’un établissement
const getByEstablishementId = (establishmentId) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM departements WHERE establishment_id = ?',
            [establishmentId],
            (err, results) => {
                if (err) reject(err);
                resolve(results);
            }
        );
    });
};

// Créer un département
const createDepartement = (data) => {
    return new Promise((resolve, reject) => {
        const { name, establishment_id, user_id } = data;
        db.query(
            'INSERT INTO departements (name, establishment_id, creator_id) VALUES (?, ?, ?)',
            [name, establishment_id, user_id],
            (err, results) => {
                if (err) reject(err);
                resolve(results);
            }
        );
    });
};

// Mettre à jour un département
const updateDepartement = (id, data) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM departements WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error("Erreur SQL (sélection):", err);
                return reject(err);
            }
            if (results.length === 0) {
                return reject(new Error("Département non trouvé"));
            }

            const { name } = data;
            db.query(
                'UPDATE departements SET name = ? WHERE id = ?',
                [name, id],
                (err, results) => {
                    if (err) {
                        console.error("Erreur SQL (mise à jour):", err);
                        reject(err);
                    }
                    resolve(results);
                }
            );
        });
    });
};

// Supprimer un département
const deleteDepartement = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM departements WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error("Erreur SQL (sélection avant suppression):", err);
                return reject(err);
            }
            if (results.length === 0) {
                return reject(new Error("Département non trouvé"));
            }

            db.query('DELETE FROM departements WHERE id = ?', [id], (err, results) => {
                if (err) {
                    console.error("Erreur SQL (suppression):", err);
                    return reject(err);
                }
                if (results.affectedRows === 0) {
                    return reject(new Error("Échec de la suppression du département"));
                }
                resolve(results);
            });
        });
    });
};

module.exports = {
    getAll,
    getById,
    getByEstablishementId,
    createDepartement,
    updateDepartement,
    deleteDepartement
};
