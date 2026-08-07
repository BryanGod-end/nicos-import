const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: { message: 'No autorizado' } });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Acceso denegado' } });
    }
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: { message: 'Token invalido o expirado' } });
  }
}

module.exports = requireAdmin;