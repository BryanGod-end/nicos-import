const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_ENCRYPT !== 'true'
  },
  connectionTimeout: 30000,
  requestTimeout: 30000
};

let pool = null;
let connecting = null;

// getPool() se puede llamar en cada request: si ya hay una conexión activa la reutiliza,
// si no existe (o se cayó) intenta conectar de nuevo en vez de quedarse en un estado roto para siempre.
async function getPool() {
  if (pool && pool.connected) {
    return pool;
  }

  if (!connecting) {
    connecting = new sql.ConnectionPool(dbConfig)
      .connect()
      .then((newPool) => {
        console.log('✅ Conectado a SQL Server -', process.env.DB_DATABASE);
        pool = newPool;
        connecting = null;
        return pool;
      })
      .catch((err) => {
        console.error('❌ Error de conexión a la base de datos:', err.message);
        connecting = null;
        throw err; // IMPORTANTE: relanzamos para que quien llame se entere del fallo real
      });
  }

  return connecting;
}

module.exports = { sql, getPool };