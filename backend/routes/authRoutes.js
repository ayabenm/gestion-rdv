const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const authModel = require('../models/authModel');

// SUPPRIMÉ : require('dotenv').config();

// Looking to send emails in production? Check out our Email API/SMTP product!
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "beaba87500ccb3",
    pass: "7e781c2d4a2779"
  }
});

let mailOptions = {
  from: '"Test Projet" <test@example.com>',
  to: "destinataire@example.com",
  subject: "Test Mailtrap",
  text: "Ceci est un email de test via Mailtrap et Nodemailer.",
  html: "<b>Ceci est un email de test via Mailtrap et Nodemailer.</b>"
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      return console.log(error);
  }
  console.log("Email envoyé: " + info.response);
});
// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, password, phone, cin, role, establishment_id } = req.body;

    if (!firstname || !lastname || !email || !password || !phone || !cin || !role) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email invalide.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères.' });
    }

    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Téléphone invalide (8 chiffres requis).' });
    }

    if (cin.length < 6 || cin.length > 15) {
      return res.status(400).json({ message: 'Le CIN doit contenir entre 6 et 15 caractères.' });
    }

    const rolesValid = ['super-admin', 'admin', 'secretaire', 'citoyen'];
    if (!rolesValid.includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const userData = {
      firstname,
      lastname,
      email,
      password: hashedPassword,
      phone,
      cin,
      role,
      establishment_id: establishment_id || null
    };

    authModel.createUser(userData, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          let duplicateField = 'Email, téléphone ou CIN';
          if (err.sqlMessage.includes('email')) duplicateField = 'Email';
          else if (err.sqlMessage.includes('phone')) duplicateField = 'Téléphone';
          else if (err.sqlMessage.includes('cin')) duplicateField = 'CIN';
          return res.status(400).json({ message: `${duplicateField} déjà utilisé.` });
        }
        return res.status(500).json({ message: 'Erreur serveur. ' + err.message });
      }
      res.status(201).json({ message: 'Inscription réussie.' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Route de connexion
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  authModel.getUserByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur.' });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, establishment_id: user.establishment_id },
      'SECRET_KEY', // vous pouvez changer la clé secrète ici
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      role: user.role,
      establishment_id: user.establishment_id
    });
  });
});

// Route de mot de passe oublié
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  authModel.getUserByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur.' });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const user = results[0];
    const resetToken = jwt.sign(
      { id: user.id },
      'SECRET_KEY',
      { expiresIn: '1h' }
    );

    const resetUrl = `http://localhost/rdv/frontend/reset-password.html?token=${resetToken}`;

    const mailOptions = {
      from: 'eyabenmessaoud123@gmail.com',
      to: email,
      subject: 'Réinitialisation du mot de passe',
      text: `Bonjour,\n\nPour réinitialiser votre mot de passe, cliquez sur le lien suivant : ${resetUrl}\n\nCe lien expire dans 1 heure.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Erreur lors de l\'envoi de l\'email:', error);
        return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email.' });
      } else {
        console.log('Email envoyé:', info.response);
        res.status(200).json({ message: 'Email de réinitialisation envoyé.' });
      }
    });
  });
});

// Route de réinitialisation du mot de passe
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token et nouveau mot de passe sont requis.' });
  }

  try {
    const decoded = jwt.verify(token, 'SECRET_KEY');
    const userId = decoded.id;

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères.' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    authModel.updatePassword(userId, hashedPassword, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du mot de passe.' });
      }
      res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
    });
  } catch (err) {
    return res.status(400).json({ message: 'Token invalide ou expiré.' });
  }
});

module.exports = router;