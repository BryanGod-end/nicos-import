const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const { getPool } = require('./config/db');
const app = express();

app.use(cors());
app.use(express.json());

// Health check: util para monitoreo y despliegues (Docker/K8s, balanceadores, etc.)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Ruta de prueba temporal para verificar conexión a SQL Server
app.get('/api/v1/test-db', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT GETDATE() AS fecha');
    res.json({ 
      status: 'ok', 
      mensaje: 'Conexión a NicosImportBD exitosa',
      fechaServidor: result.recordset[0].fecha 
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'error', 
      mensaje: 'Error al conectar con la base de datos',
      error: err.message,
      code: err.code || null
    });
  }
});

// Rutas de la API, versionadas para poder evolucionar sin romper clientes existentes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);

// 404 para rutas no encontradas
app.use(notFound);

// Manejador de errores centralizado (siempre al final)
app.use(errorHandler);

module.exports = app;