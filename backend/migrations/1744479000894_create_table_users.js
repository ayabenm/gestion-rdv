module.exports = {
    "up": "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, firstname VARCHAR(100) NOT NULL, lastname VARCHAR(100) NOT NULL, email VARCHAR(150) UNIQUE, password VARCHAR(255) NOT NULL, phone VARCHAR(20) UNIQUE NOT NULL, cin VARCHAR(15) UNIQUE NOT NULL, role ENUM('superadmin', 'admin', 'secretaire', 'citoyen') NOT NULL, establishment_id INT NULL, FOREIGN KEY (establishment_id) REFERENCES establishments(id) ON DELETE CASCADE, date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
    "down": "DROP TABLE users"
}