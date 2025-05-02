const db = require('../config/db');

const DashboardModel = {
    // 📊 Répartition des utilisateurs
    getUsersDistribution: (callback) => {
        const sql = `
            SELECT role, COUNT(*) AS count
            FROM users
            GROUP BY role
        `;
        db.query(sql, callback);
    },

    // 📊 Rendez-vous par mois
    getAppointmentsPerMonth: (callback) => {
        const sql = `
            SELECT DATE_FORMAT(date_rdv, '%Y-%m') AS month, COUNT(*) AS count
            FROM appointment
            GROUP BY month
            ORDER BY month DESC
            LIMIT 12
        `;
        db.query(sql, callback);
    },

    // 🕑 Activités récentes
    getRecentActivities: (callback) => {
        const sql = `
            SELECT id, firstname, lastname, role, DATE_FORMAT(date_creation, '%d/%m/%Y %H:%i') AS created_at
            FROM users
            ORDER BY date_creation DESC
            LIMIT 5
        `;
        db.query(sql, callback);
    },

    // 🏆 Statistiques globales
    getTotalUsers: (callback) => {
        db.query('SELECT COUNT(*) AS totalUsers FROM users', callback);
    },

    getTotalEstablishments: (callback) => {
        db.query('SELECT COUNT(*) AS totalEstablishments FROM establishments', callback);
    },

    getTotalDepartments: (callback) => {
        db.query('SELECT COUNT(*) AS totalDepartments FROM departements', callback);
    },

    getTotalAppointments: (callback) => {
        db.query('SELECT COUNT(*) AS totalAppointments FROM appointment', callback);
    },

    getActiveUsersToday: (callback) => {
        db.query(`
            SELECT COUNT(DISTINCT id) AS activeUsersToday
            FROM users
            WHERE DATE(date_creation) = CURDATE()
        `, callback);
    }
};

module.exports = DashboardModel;
