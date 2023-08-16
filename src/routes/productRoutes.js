const express = require('express');
const { 
    createProduct, 
    getAllProduct,
    getProductById,
    getProductByCategoryId,
    uploadProductImg,
    upload,
    getDataTableForProductByRestaurantId,
    editProductByProductId,
    deleteProduct} = require('../controllers/productController');

    const router = express.Router();


    router.post('/createProduct', createProduct);
    router.get('/getAllProduct', getAllProduct);
    router.get('/getProductById',getProductById);
    router.get('/getProductByCategoryId',getProductByCategoryId);
    router.post('/getDataTableForProductByRestaurantId/:id',getDataTableForProductByRestaurantId);
    router.post('/uploadProductImg',upload.array('productImg'),uploadProductImg);
    router.put('/editProductByProductId',editProductByProductId);
    router.delete('/deleteProduct/:id',deleteProduct);
    

    
    module.exports = router;