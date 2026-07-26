// Manejador centralizado: cualquier error de la app termina aquí en vez de
// tumbar el servidor o filtrar detalles internos al cliente.
module.exports = function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  console.error(`[${new Date().toISOString()}] ${statusCode} - ${err.message}`);

  res.status(statusCode).json({
    error: {
      message: err.message || 'Error interno del servidor',
    },
  });
};
