module.exports = {
    "up": "CREATE TABLE establishments (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, address TEXT NOT NULL, phone VARCHAR(20), email VARCHAR(150), date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
    "down": "DROP TABLE establishments"
}