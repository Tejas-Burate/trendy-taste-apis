const express = require('express');
const { 
    createCategory, 
    getAllCategory,
    getCategoryById,
    editCategoryByCategoryId,
    deleteCategory,
    getCategoryByRestaurantManagerId,
    getDataTableForCategoryByRestaurantId,
    uploadCategoryImg,
    upload,
    getCategoryByRestaurantId} = require('../controllers/categoryController');

const router = express.Router();

router.post('/createCategory', createCategory);
router.get('/getAllCategory',getAllCategory);
router.post('/getCategoryById',getCategoryById);
router.post('/getCategoryByRestaurantId',getCategoryByRestaurantId);
router.post('/getCategoryByRestaurantManagerId',getCategoryByRestaurantManagerId);
router.put('/editCategoryByCategoryId',editCategoryByCategoryId);
router.post('/uploadCategoryImg',upload.array('categoryImg'),uploadCategoryImg);
router.post('/getDataTableForCategoryByRestaurantId/:id',getDataTableForCategoryByRestaurantId);
router.delete('/deleteCategory/:id',deleteCategory);
module.exports = router;
