const { getPool, sql } = require('../config/db');

async function findAll({ category } = {}) {
  const pool = await getPool();
  const request = pool.request();

  let query = `
    SELECT 
      ProductoId AS id,
      Nombre AS name,
      Categoria AS category,
      Precio AS price,
      Stock AS stock,
      ImagenUrl AS image,
      Descripcion AS description
    FROM Productos
    WHERE Activo = 1
  `;

  if (category) {
    query += ' AND Categoria = @category';
    request.input('category', sql.NVarChar, category);
  }

  const result = await request.query(query);
  return result.recordset;
}

async function findById(id) {
  const pool = await getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT 
        ProductoId AS id,
        Nombre AS name,
        Categoria AS category,
        Precio AS price,
        Stock AS stock,
        ImagenUrl AS image,
        Descripcion AS description
      FROM Productos
      WHERE ProductoId = @id AND Activo = 1
    `);

  return result.recordset[0] || null;
}

module.exports = { findAll, findById };