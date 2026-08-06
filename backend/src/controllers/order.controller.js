const orderModel = require('../models/order.model');

async function createOrder(req, res, next) {
  try {
    const { identificacion, entrega, items, total, metodoPago } = req.body;

    if (!identificacion || !identificacion.documento || !identificacion.correo) {
      const error = new Error('Faltan datos de identificacion del cliente');
      error.statusCode = 400;
      throw error;
    }

    if (!Array.isArray(items) || items.length === 0) {
      const error = new Error('El pedido no tiene productos');
      error.statusCode = 400;
      throw error;
    }

    if (!total || total <= 0) {
      const error = new Error('El total del pedido no es valido');
      error.statusCode = 400;
      throw error;
    }

    const resultado = await orderModel.createOrder({
      identificacion, entrega, items, total, metodoPago,
    });

    res.status(201).json({ data: resultado });
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder };