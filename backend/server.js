const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const establishmentRoutes = require('./routes/establishmentRoutes');
const establishmentcitoyenRoutes = require('./routes/establishmentCitoyenRoutes');
const departementRoutes = require('./routes/departmentRoutes'); 
const serviceRoutes = require('./routes/serviceRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const path = require('path');
const verifyToken = require('./middleware/verifyToken');
const verifySuperadmin = require('./middleware/verifySuperadmin');
const verifyCitoyen = require('./middleware/verifyCitoyen');
const app = express();


app.use(cors());
app.use(bodyParser.json());
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend')));  // Servir les fichiers statiques
app.use('/api/establishments', [verifyToken, verifySuperadmin], establishmentRoutes);
app.use('/api/citoyen/establishments', [verifyToken, verifyCitoyen], establishmentcitoyenRoutes);
app.use('/api/services', verifyToken, serviceRoutes);
app.use('/api/departements', verifyToken, departementRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/appointments', verifyToken, appointmentRoutes);
app.use('/api', verifyToken, dashboardRoutes);

app.get('/', (req, res) => {
    res.send("Bienvenue sur l'API de gestion des établissements et départements");
});





const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
