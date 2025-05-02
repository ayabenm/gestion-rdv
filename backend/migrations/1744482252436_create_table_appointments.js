module.exports = {
    "up": "CREATE TABLE appointments (id INT AUTO_INCREMENT PRIMARY KEY, citoyen_id INT NOT NULL, service_id INT NOT NULL, point_contact VARCHAR(255), date_rdv DATETIME NOT NULL, objet TEXT NULL, statut ENUM('en_attente', 'validé', 'rejeté', 'annulé') DEFAULT 'en_attente', date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (citoyen_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE)",
    "down": "DROP TABLE appointments"
}