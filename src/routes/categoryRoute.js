const express = require('express');
const { 
    createCategory, 
    getAllCategory,
    getCategoryById,
    editCategoryByCategoryId,
    deleteCategory,
    getCategoryByRestaurantManagerId,
    getDataTableForCategoryByRestaurantId,
    getCategoryByRestaurantId} = require('../controllers/categoryController');

const router = express.Router();

router.post('/createCategory', createCategory);
router.get('/getAllCategory',getAllCategory);
router.get('/getCategoryById/:id',getCategoryById);
router.get('/getCategoryByRestaurantId/:id',getCategoryByRestaurantId);
router.get('/getCategoryByRestaurantManagerId/:id',getCategoryByRestaurantManagerId);
router.put('/editCategoryByCategoryId/:id',editCategoryByCategoryId);
router.post('/getDataTableForCategoryByRestaurantId/:id',getDataTableForCategoryByRestaurantId);
router.delete('/deleteCategory/:id',deleteCategory);
module.exports = router;
