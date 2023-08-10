const express = require('express');
const { addToCart, getCartById, removeFromCart } = require('../controllers/cartController');

const router = express.Router();

router.get('/getCartById/:id', getCartById);
router.post('/addToCart', addToCart);
router.post('/removeFromCart', removeFromCart);

module.exports = router;
