const bcrypt = require('bcrypt');
const hashedPassword = bcrypt.hashSync('password', 10);

module.exports = {
    "up": "INSERT INTO users (firstname, lastname, email, password, phone, cin, role) VALUES ('super', 'admin', 'superadmin@test.com', '" + hashedPassword + "', '55000000', '12345678', 'superadmin')",
    "down": "DELETE FROM users"
}