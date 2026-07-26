const productModel = require('../models/product.model');

// El carrito vive en el frontend (localStorage/estado), pero el total y el
// stock SIEMPRE se validan aquí. Nunca hay que confiar en precios que vienen
// del cliente: evita que alguien manipule el total desde el navegador.
async function calculateCart(req, res, next) {
  try {
    const { items } = req.body; // [{ productId, quantity }]

    if (!Array.isArray(items) || items.length === 0) {
      const error = new Error('El carrito está vacío o tiene un formato inválido');
      error.statusCode = 400;
      throw error;
    }

    let total = 0;
    const detailedItems = [];

    for (const item of items) {
      const product = await productModel.findById(item.productId);

      if (!product) {
        const error = new Error(`Producto ${item.productId} no existe`);
        error.statusCode = 404;
        throw error;
      }

      if (item.quantity > product.stock) {
        const error = new Error(`Stock insuficiente para "${product.name}"`);
        error.statusCode = 409;
        throw error;
      }

      const subtotal = product.price * item.quantity;
      total += subtotal;

      detailedItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal,
      });
    }

    res.json({ data: { items: detailedItems, total: Number(total.toFixed(2)) } });
  } catch (err) {
    next(err);
  }
}

module.exports = { calculateCart };
