const productModel = require('../models/product.model');

async function getProducts(req, res, next) {
  try {
    const { category } = req.query;
    const products = await productModel.findAll({ category });
    res.json({ data: products });
  } catch (err) {
    next(err); // delega al errorHandler centralizado
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProducts, getProductById };
