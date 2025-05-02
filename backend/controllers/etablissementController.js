const db = require('../config/db');

exports.getAllEtablissements = (req, res) => {
    db.query('SELECT * FROM etablissements', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

exports.createEtablissement = (req, res) => {
    const { nom, adresse, telephone, email } = req.body;
    db.query(
        'INSERT INTO etablissements (nom, adresse, telephone, email) VALUES (?, ?, ?, ?)',
        [nom, adresse, telephone, email],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Établissement ajouté', id: results.insertId });
        }
    );
};

exports.updateEtablissement = (req, res) => {
    const { id } = req.params;
    const { nom, adresse, telephone, email } = req.body;
    db.query(
        'UPDATE etablissements SET nom = ?, adresse = ?, telephone = ?, email = ? WHERE id = ?',
        [nom, adresse, telephone, email, id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Établissement mis à jour' });
        }
    );
};

exports.deleteEtablissement = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM etablissements WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Établissement supprimé' });
    });
};
