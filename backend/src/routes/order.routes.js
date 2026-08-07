const express = require('express');
const { createOrder, getOrders, getOrderById } = require('../controllers/order.controller');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

router.post('/', createOrder);
router.get('/', requireAdmin, getOrders);
router.get('/:id', requireAdmin, getOrderById);

module.exports = router;