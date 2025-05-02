module.exports = {
    "up": "CREATE TABLE departements (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, establishment_id INT, creator_id INT, FOREIGN KEY (establishment_id) REFERENCES establishments(id) ON DELETE CASCADE, FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE)",
    "down": "DROP TABLE departements"
}