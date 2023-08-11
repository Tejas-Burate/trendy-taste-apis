const express = require('express');
const { 
    addToCart,
    getCart, 
    getCartByUserId, 
    removeFromCart } = require('../controllers/cartController');

const router = express.Router();

router.get('/getCartByUserId/:id', getCartByUserId);
router.get('/getCart', getCart);
router.post('/addToCart', addToCart);
router.post('/removeFromCart', removeFromCart);

module.exports = router;
