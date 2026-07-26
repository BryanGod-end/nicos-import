const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const cartRoutes = require('./routes/cart.routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Health check: util para monitoreo y despliegues (Docker/K8s, balanceadores, etc.)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas de la API, versionadas para poder evolucionar sin romper clientes existentes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);

// 404 para rutas no encontradas
app.use(notFound);

// Manejador de errores centralizado (siempre al final)
app.use(errorHandler);

module.exports = app;
