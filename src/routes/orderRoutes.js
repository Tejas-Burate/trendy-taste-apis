const express = require('express');
const { 
    placeOrder, 
    getAllOrders,
    getOrderByUserId} = require('../controllers/orderController');

const router = express.Router();

router.post('/placeOrder',placeOrder);
router.get('/getAllOrders',getAllOrders);
router.get('/getOrderByUserId/:id',getOrderByUserId);
module.exports = router;