const express = require('express');
const { calculateCart } = require('../controllers/cart.controller');

const router = express.Router();

router.post('/calculate', calculateCart);

module.exports = router;
