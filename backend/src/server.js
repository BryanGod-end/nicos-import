require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Nico's Import API corriendo en el puerto ${PORT}`);
});

// Manejo de errores no controlados para que el servidor no muera en silencio
// (útil para diagnosticar fallos en producción con el tiempo)
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
