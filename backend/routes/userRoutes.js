const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Ajouter un utilisateur
router.post('/', (req, res) => {
  const newUser = req.body;

  if (req.user.role === 'admin') {
    newUser.establishment_id = req.user.establishment_id
  }
  
  if (!newUser.firstname || !newUser.lastname || !newUser.email || !newUser.password || !newUser.role || !newUser.phone || !newUser.cin || !newUser.establishment_id) {
    return res.status(400).json({ error: 'Tous les champs doivent être remplis' });
  }

  User.create(newUser, (err, result) => {
    if (err) {
      console.error('Erreur lors de l’ajout de l\'utilisateur :', err);
      return res.status(500).json({ error: 'Erreur lors de l’ajout' });
    }
    res.status(201).json({ message: 'Utilisateur ajouté avec succès', id: result.insertId });
  });
});

// Modifier un utilisateur
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  if (!updatedUser.first_name || !updatedUser.name || !updatedUser.email || !updatedUser.role || !updatedUser.phone || !updatedUser.cin) {
    return res.status(400).json({ error: 'Tous les champs doivent être remplis' });
  }

  User.update(id, updatedUser, (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur :', err);
      return res.status(500).json({ error: 'Erreur lors de la modification' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur modifié avec succès' });
  });
});

// Supprimer un utilisateur
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  User.delete(id, (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', err);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur supprimé avec succès' });
  });
});

// Obtenir tous les utilisateurs
router.get('/', (req, res) => {
  if (req.user.role === 'superadmin') {
    User.getAll((err, users) => {
      if (err) {
        console.error('Erreur lors du chargement des utilisateurs :', err);
        return res.status(500).json({ error: 'Erreur de chargement des utilisateurs' });
      }
      res.json(users);
    });
  } else {
    User.getAllByEstablishmentId(req.user.establishment_id, (err, users) => {
      if (err) {
        console.error('Erreur lors du chargement des utilisateurs :', err);
        return res.status(500).json({ error: 'Erreur de chargement des utilisateurs' });
      }
      res.json(users);
    });
  }
});

// Obtenir un utilisateur par ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  User.getById(id, (err, user) => {
    if (err) {
      console.error('Erreur lors du chargement de l\'utilisateur :', err);
      return res.status(500).json({ error: 'Erreur de chargement de l\'utilisateur' });
    }
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  });
});

// Obtenir un utilisateur par ID
router.get('/user/current', (req, res) => {
  const { id } = req.user;
  User.getById(id, (err, user) => {
    if (err) {
      console.error('Erreur lors du chargement de l\'utilisateur :', err);
      return res.status(500).json({ error: 'Erreur de chargement de l\'utilisateur' });
    }
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  });
});

router.put('/edit/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  if (!updatedUser.firstname || !updatedUser.lastname || !updatedUser.email || !updatedUser.phone || !updatedUser.cin) {
    return res.status(400).json({ error: 'Tous les champs doivent être remplis' });
  }

  User.updateProfile(id, updatedUser, (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur :', err);
      return res.status(500).json({ error: 'Erreur lors de la modification' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur modifié avec succès' });
  });
});
module.exports = router;
