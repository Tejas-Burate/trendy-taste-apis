const express = require('express');
const validateAdmin = require('../middlewares/validateAdmin');
const { 
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    getRestaurantByCampusId,
    getRestaurantByUserId,
    editRestaurantByRestaurantId,
    getDataTableForRestaurantBycampusId,
    deleteRestaurant,
    uploadRestaurantImg, 
    upload} = require('../controllers/restaurantController');

router = express.Router();

router.post('/createRestaurant',createRestaurant);
router.get('/getAllRestaurants',getAllRestaurants);
router.get('/getRestaurantById',getRestaurantById);
router.get('/getRestaurantByCampusId',getRestaurantByCampusId);
router.get('/getRestaurantByUserId',getRestaurantByUserId);
router.put('/editRestaurantByRestaurantId',editRestaurantByRestaurantId);
router.post('/getDataTableForRestaurantBycampusId/:id',getDataTableForRestaurantBycampusId);
router.delete('/deleteRestaurant/:id',validateAdmin,deleteRestaurant);
router.post('/uploadRestaurantImg',upload.single('restaurantImg'),uploadRestaurantImg);

module.exports = router ;