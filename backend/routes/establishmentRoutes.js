const express = require('express');
const router = express.Router();
const Establishment = require('../models/establishmentModel');

router.get('/', async (req, res) => {
    try {
        let results;
        if (req.user.role === 'superadmin') {
            // 🔓 Super admin : tous les établissements
            results = await Establishment.getAllEstablishments();
        } else if (req.user.role === 'admin') {
            // 🔒 Admin : seulement son établissement
            const Establishment = await Establishment.getById(req.user.establishment_id);
            if (!Establishment) {
                return res.status(404).json({ error: 'Établissement non trouvé' });
            }
            results = [Establishment]; // on met dans un tableau pour garder le même format
        } else {
            return res.status(403).json({ error: 'Accès refusé' });
        }

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route pour récupérer un établissement par ID
router.get('/:id', async (req, res) => {
    try {
        const result = await Establishment.getById(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Établissement non trouvé' });
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route pour ajouter un établissement
router.post('/', async (req, res) => {
    try {
        const results = await Establishment.createEstablishment(req.body);
        res.status(201).json({ message: 'Établissement ajouté', id: results.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;