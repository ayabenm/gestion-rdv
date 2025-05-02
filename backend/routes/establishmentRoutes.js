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
// Route PUT mise à jour
router.put('/:id', async (req, res) => {
    try {
        const { name, address, phone, email } = req.body;

        if (!name || !address || !phone || !email) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        const etablissement = await Establishment.getById(req.params.id);
        if (!etablissement) {
            return res.status(404).json({ error: 'Établissement non trouvé' });
        }

        await Establishment.updateEstablishment(req.params.id, req.body);
        res.status(200).json({ message: 'Établissement mis à jour' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route DELETE suppression
router.delete('/:id', async (req, res) => {
    try {
        await Establishment.deleteEstablishment(req.params.id);
        res.status(200).json({ message: 'Établissement supprimé' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;