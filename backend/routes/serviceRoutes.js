const express = require('express');
const router = express.Router();
const Service = require('../models/serviceModel');

// Récupérer les services associés à un département
router.get('/:departementId', async (req, res) => {
    try {
        const services = await Service.getAllByDepartment(req.params.departementId);
        res.json(services);
    } catch (err) {
        console.error("Erreur de serveur lors de la récupération des services : ", err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Ajouter un service
router.post('/', async (req, res) => {
    const { name, priority, departement_id } = req.body;
    const user_id = req.user.id;
    if (!name || !priority  || !departement_id || !user_id) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    try {
        await Service.create(name, priority, departement_id, user_id);
        res.json({ message: 'Service ajouté avec succès' });
    } catch (err) {
        console.error("Erreur serveur lors de l'ajout du service : ", err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Mettre à jour un service
router.put('/:id', async (req, res) => {
    const { name, priority, departement_id } = req.body;
    if (!name || !priority) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    try {
        const result = await Service.update(req.params.id, name, priority);
        if (result.affectedRows > 0) {
            return res.json({ message: 'Service mis à jour avec succès' });
        } else {
            return res.status(404).json({ error: 'Service introuvable' });
        }
    } catch (err) {
        console.error("Erreur serveur lors de la mise à jour du service : ", err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Supprimer un service
router.delete('/:id', async (req, res) => {
    try {
        await Service.delete(req.params.id);
        res.json({ message: 'Service supprimé avec succès' });
    } catch (err) {
        console.error("Erreur serveur lors de la suppression du service : ", err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
