const express = require('express');
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

module.exports = router;
