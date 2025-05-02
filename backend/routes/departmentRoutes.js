const express = require('express');
const router = express.Router();
const Departement = require('../models/departementModel');

// 🟢 Récupérer tous les départements
router.get('/', async (req, res) => {
    try {
        const results = await (req.user.role === 'superadmin' ? Departement.getAll() : Departement.getByEstablishementId(req.user.establishment_id)); 
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 🟢 Récupérer les départements d’un établissement donné
router.get('/establishment/:establishmentId', async (req, res) => {
    try {
        const results = await Departement.getByEstablishementId(req.params.establishmentId);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Aucun département trouvé pour cet établissement.' });
        }
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 🟢 Ajouter un département
router.post('/', async (req, res) => {
    try {
        const name= req.body.name;
        const establishment_id = req.user.role === 'superadmin' ? req.body.establishment_id : req.user.establishment_id;
        const user_id = req.user.id;
        if (!name || !establishment_id || !user_id) {
            return res.status(400).json({ error: 'Name, establishment_id et user_id sont requis' });
        }
        const result = await Departement.createDepartement({ name, establishment_id, user_id });
        res.status(201).json({ message: 'Département ajouté', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 🟢 Mettre à jour un département
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Le nom du département est requis' });
        }

        const result = await Departement.updateDepartement(req.params.id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Département non trouvé' });
        }

        res.status(200).json({ message: 'Département mis à jour' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 🟢 Supprimer un département
router.delete('/:id', async (req, res) => {
    try {
        const departement = await Departement.getById(req.params.id);
        if (!departement) {
            return res.status(404).json({ error: 'Département non trouvé' });
        }

        await Departement.deleteDepartement(req.params.id);
        res.status(200).json({ message: 'Département supprimé avec succès' });
    } catch (err) {
        console.error("Erreur lors de la suppression du département:", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

module.exports = router;
