const express = require('express');
const { 
    createOrder, 
    getAllOrders,
    getOrderByUserId} = require('../controllers/orderController');

const router = express.Router();

router.post('/createOrder',createOrder);
router.get('/getAllOrders',getAllOrders);
router.get('/getOrderByUserId/:id',getOrderByUserId);
module.exports = router;