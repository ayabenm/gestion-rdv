module.exports = {
    "up": "CREATE TABLE services (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL UNIQUE, priority INT NOT NULL, departement_id INT, creator_id INT, FOREIGN KEY (departement_id) REFERENCES departements(id) ON DELETE CASCADE, FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE)",
    "down": "DROP TABLE services"
}