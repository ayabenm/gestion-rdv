const db = require('../config/db');

const Appointment = {
// Créer un nouveau rendez-vous
createAppointment : ({ citoyen_id, establishment_id, departement_id, service_id, date_rdv, preferred_date , deadline, point_contact}, callback) => {
  const sql = `
      INSERT INTO appointments (citoyen_id,  establishment_id, departement_id, service_id, date_rdv, preferred_date ,deadline, point_contact)
      VALUES (?, ?, ?, ?, ?, ?, ?,?)
    `;
  db.query(sql, [citoyen_id, establishment_id, departement_id, service_id, date_rdv, preferred_date ,deadline, point_contact], callback);
},

// Requête pour récupérer tous les rendez-vous d'un citoyen
getAppointmentsByCitizen : (citoyenId, callback) => {
  const sql = 'SELECT a.id AS id, a.date_rdv AS date,a.preferred_date AS preferred_date, a.deadline AS deadline, a.statut AS statut, e.name AS establishment, d.name AS department, s.name AS service, s.priority AS service_priority FROM appointments a JOIN establishments e ON a.establishment_id = e.id JOIN departements d ON a.departement_id = d.id JOIN services s ON a.service_id = s.id WHERE a.citoyen_id = ? ORDER BY a.date_rdv ASC, a.deadline ASC';
  db.query(sql, [citoyenId], callback);
},

// Modifier le statut d'un rendez-vous 
editAppointmentStatut : (id, statut, callback) => {
  const sql = 'UPDATE appointments SET statut = ? WHERE id = ?';
  db.query(sql, [statut, id], callback);
}
}

module.exports = Appointment;
