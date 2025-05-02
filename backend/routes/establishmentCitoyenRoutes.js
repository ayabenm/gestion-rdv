const express = require('express');
const router = express.Router();
const Establishment = require('../models/establishmentModel');

router.get('/', async (req, res) => {
    try {
        let results;
        results = await Establishment.getAllEstablishments();
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;