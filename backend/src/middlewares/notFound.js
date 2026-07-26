module.exports = function notFound(req, res, next) {
  res.status(404).json({
    error: { message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` },
  });
};
