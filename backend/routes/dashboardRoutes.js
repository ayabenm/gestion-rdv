const express = require('express');
const router = express.Router();
const DashboardModel = require('../models/dashboardModel');


// 📊 Répartition des utilisateurs
router.get('/users-distribution', (req, res) => {
    DashboardModel.getUsersDistribution((err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// 📊 Rendez-vous par mois
router.get('/appointments-per-month', (req, res) => {
    DashboardModel.getAppointmentsPerMonth((err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// 🕑 Activités récentes
router.get('/recent-activities', (req, res) => {
    DashboardModel.getRecentActivities((err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// 🏆 Statistiques globales
router.get('/stats', (req, res) => {
    const results = {};

    DashboardModel.getTotalUsers((err, result) => {
        if (err) return res.status(500).json({ error: err });
        results.totalUsers = result[0].totalUsers;

        DashboardModel.getTotalEstablishments((err, result) => {
            if (err) return res.status(500).json({ error: err });
            results.totalEstablishments = result[0].totalEstablishments;

            DashboardModel.getTotalDepartments((err, result) => {
                if (err) return res.status(500).json({ error: err });
                results.totalDepartments = result[0].totalDepartments;

                DashboardModel.getTotalAppointments((err, result) => {
                    if (err) return res.status(500).json({ error: err });
                    results.totalAppointments = result[0].totalAppointments;

                    DashboardModel.getActiveUsersToday((err, result) => {
                        if (err) return res.status(500).json({ error: err });
                        results.activeUsersToday = result[0].activeUsersToday;

                        res.json(results);
                    });
                });
            });
        });
    });
});

module.exports = router;
