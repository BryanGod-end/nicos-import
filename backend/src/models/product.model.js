const products = require('../data/products');

// Esta capa simula un modelo de base de datos.
// El día que se conecte MongoDB/PostgreSQL, solo se reescriben estas funciones
// (por ejemplo con Mongoose o Prisma) y el resto de la app no cambia.

async function findAll({ category } = {}) {
  if (category) {
    return products.filter((p) => p.category === category);
  }
  return products;
}

async function findById(id) {
  return products.find((p) => p.id === Number(id)) || null;
}

module.exports = { findAll, findById };
