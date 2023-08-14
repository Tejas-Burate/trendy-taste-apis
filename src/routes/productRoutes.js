const express = require('express');
const { 
    createProduct, 
    getAllProduct,
    getProductById,
    getProductsByRestaurantId,
    getDataTableForProductByRestaurantId,
    editProductByProductId,
    deleteProduct} = require('../controllers/productController');

    const router = express.Router();


    router.post('/createProduct', createProduct);
    router.get('/getAllProduct', getAllProduct);
    router.get('/getProductById',getProductById);
    router.get('/getProductsByRestaurantId',getProductsByRestaurantId);
    router.post('/getDataTableForProductByRestaurantId/:id',getDataTableForProductByRestaurantId);
    router.put('/editProductByProductId',editProductByProductId);
    router.delete('/deleteProduct/:id',deleteProduct);
    

    
    module.exports = router;