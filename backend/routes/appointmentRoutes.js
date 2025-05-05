const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointmentModel');
const db = require('../config/db'); // Add this line to import the db connection

// Route pour récupérer les rendez-vous
router.get('/', async (req, res) => {
  const { id, role, establishment_id } = req.user;
  
  if (role === 'secretaire') {
      // For secretaries, get appointments for their establishment
      const sql = `
          SELECT 
              a.id, 
              a.date_rdv AS date,
              a.preferred_date,
              a.deadline,
              a.statut,
              e.name AS establishment,
              d.name AS department,
              s.name AS service,
              s.priority AS service_priority,
              CONCAT(u.firstname, ' ', u.lastname) AS citizen_name
          FROM appointments a
          JOIN establishments e ON a.establishment_id = e.id
          JOIN departements d ON a.departement_id = d.id
          JOIN services s ON a.service_id = s.id
          JOIN users u ON a.citoyen_id = u.id
          WHERE a.establishment_id = ?
          ORDER BY a.date_rdv ASC, a.deadline ASC
      `;
      
      db.query(sql, [establishment_id], (err, appointments) => {
          if(err) {
              res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous', error: err });
          } else {
              res.status(200).json(appointments);
          }
      });
  } else {
      // Original citizen query remains the same
      Appointment.getAppointmentsByCitizen(id, (err, appointments) => {
          if(err) {
              res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous', error: err });
          } else {
              res.status(200).json(appointments);
          } 
      });
  }
});


// Enregistrement d'un rendez-vous
router.post('/', async (req, res) => {
    const {
      establishment_id,
      departement_id,
      service_id,
      date_rdv,
      preferred_date,
      deadline,
      point_contact
    } = req.body;
    let citoyen_id = req.user.id

    if (!citoyen_id || !establishment_id || !departement_id || !service_id || !date_rdv || !preferred_date || !deadline || !point_contact) {
      return res.status(400).json({ message: "Champs manquants" });
    }
    let appointmentData = {citoyen_id, establishment_id, departement_id, service_id, date_rdv, preferred_date, deadline, point_contact,}
    Appointment.createAppointment(appointmentData, (err, appointment) => {      
      if (err) {
        console.error("Erreur POST /appointment:", err); 
        res.status(500).json({ message: "Erreur lors de l'enregistrement du rendez-vous" });
      } else {
        res.status(201).json({ message: "Rendez-vous enregistré avec succès", appointment });
      }
    });
});

// Modifier le statut d'un rendez-vous
router.put('/:id', async (req, res) => {
    const { status } = req.body;
    let id = req.params.id

    if (!status) {
      return res.status(400).json({ message: "Champs manquants" });
    }
    Appointment.editAppointmentStatut(id, status, (err, result) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du rendez-vous :', err);
        return res.status(500).json({ error: 'Erreur lors de la modification' });
      } else {
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Rendez-vous non trouvé' });
        return res.json({ message: 'Rendez-vous annulé avec succès' });
      }
    })
});

module.exports = router;
