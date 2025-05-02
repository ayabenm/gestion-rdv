const db = require('../config/db');

const Service = {
    // 🔍 Récupérer tous les services associés à un département
    getAllByDepartment: async (departementId) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT s.id, s.name, s.priority
                 FROM services s
                 WHERE s.departement_id = ?`, [departementId],
                (err, results) => {
                    if (err) {
                        console.error("Erreur dans la récupération des services : ", err);
                        return reject(err);
                    }
                    resolve(results);
                });
        });
    },

    // ➕ Créer un service et l’associer à un département
    create: async (nom, priorite, departement_id, user_id) => {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO services (name, priority, departement_id, creator_id) VALUES (?, ?, ?, ?)',
                [nom, priorite, departement_id, user_id],
                (err, result) => {
                    if (err) {
                        console.error("Erreur lors de la création du service : ", err);
                        return reject(err);
                    }
                    resolve(result);
                });
        });
    },

    // ✏️ Mettre à jour un service
    update: async (id, name, priority, departement_id) => {
        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE services SET name = ?, priority = ? WHERE id = ?',
                [name, priority, id],
                (err, result) => {
                    if (err) {
                        console.error("Erreur lors de la mise à jour du service : ", err);
                        return reject(err);
                    }
                    console.log(`Service mis à jour avec ID ${id}`);
                    resolve(result);
                });
        });
    },

    // 🗑️ Supprimer un service
    delete: async (id) => {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM services WHERE id = ?', [id], (err, result) => {
                if (err) {
                    console.error("Erreur lors de la suppression du service : ", err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
};

module.exports = Service;
