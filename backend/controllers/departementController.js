const db = require('../config/db');

exports.getAll = (req, res) => {
    db.query('SELECT * FROM departements', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

exports.createDepartement = (req, res) => {
    const { nom, etablissement_id } = req.body;
    db.query(
        'INSERT INTO departements (nom, etablissement_id) VALUES (?, ?)',
        [nom, etablissement_id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Département ajouté', id: results.insertId });
        }
    );
};

exports.updateDepartement = (req, res) => {
    const { id } = req.params;
    const { nom } = req.body;
    db.query(
        'UPDATE departements SET nom = ? WHERE id = ?',
        [nom, id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Département mis à jour' });
        }
    );
};

exports.deleteDepartement = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM departements WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Département supprimé' });
    });
};
