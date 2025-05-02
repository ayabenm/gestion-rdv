module.exports = (req, res, next) => {
  const role = req.user.role;

  if (role !== 'citoyen') {
    return res.status(403).json({ message: 'Role invalide' });
  }
  next();
};
