module.exports = {
    "up": "CREATE TABLE notifications (id INT AUTO_INCREMENT PRIMARY KEY, appointment_id INT NOT NULL, type ENUM('sms', 'email') NOT NULL, statut ENUM('envoyé', 'échoué', 'en attente') DEFAULT 'en attente', date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE)",
    "down": "DROP TABLE notifications"
}