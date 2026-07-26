const categories = require('../data/categories');

async function findAll() {
  return categories;
}

module.exports = { findAll };
