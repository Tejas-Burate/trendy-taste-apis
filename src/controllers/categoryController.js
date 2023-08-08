const express = require('express');
const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');
const Restaurant = require('../models/restaurantModel');

//Create Category
const createCategory = asyncHandler(async(req,res) =>{
    const {categoryName, categoryImg, description, restaurantId} = req.body;

    try{
    const category = await Category.create({
        categoryName,
        categoryImg,
        description,
        restaurantId,
    })

    res.status(201).json({status:201, error:"success",message:"Category created successfully"});
    }catch(error){
        if (error.name === 'ValidationError') {
            // Mongoose validation error
            const validationErrors = Object.values(error.errors).map(err => err.message);
            res.status(400).json({ status: 400, error: 'Validation Error', messages: validationErrors });
          } else if (error.code === 11000) {
            // Mongoose unique constraint error (MongoError)
            const duplicateField = Object.keys(error.keyPattern)[0];
            const message = `${duplicateField} already exists.`;
            res.status(409).json({ status: 409, error: 'Conflict', message });
          } else {
            // Other types of errors (e.g., database connection errors)
            res.status(500).json({ status: 500, error: 'Server Error', message: 'An error occurred while processing your request.' });
          }

    }
})


//Get All Categories

const getAllCategory = asyncHandler(async(req,res) =>{
    try{
        const category = await Category.find();

        if(category.length === 0){
            res.status(404).json({status:404, error: "404", message: "Categories Not Found"})
            return;
        }
        res.status(200).json(category);
    }catch(error){
        res.status(500).json({ status: 500, error: '500', message: 'Internal Server Error' });
    }
})

//Get Category By Id

const getCategoryById = asyncHandler(async(req,res) => {
    try {

        const category = await Category.findById(req.params.id);
        if(!category){
            res.status(404).json({status:404, error: "400", message: "Category of given Id is not found"});
            return;
        }
        res.status(200).json(category);
        
    } catch (error) {
        res.status(500).json({status:500, error: "500", message:"Internal Server Error"});
    }
})


// Get Category By Restaurant ID

const getCategoryByRestaurantId = asyncHandler(async(req,res) => {
    try {
        const restaurant = await Restaurant.findOne({_id : req.params.id});
    if(!restaurant){
        res.status(404).json({status:404, error: "404", message: " Given Restauarnt Id is not found"});
    }

    const category = await Category.find({restaurantId : req.params.id});
    if(category.length === 0){
        res.status(404).json({status:404, error: "404", message: " Category of Given Restaurant Id is not found"});
    }
    res.status(200).json(category);
    } catch (error) {
        console.log('error', error)
        res.status(500).json({status:500, error: "500", message:"Internal Server Error"});
    }
    
})

//Update Category

const editCategoryByCategoryId = asyncHandler(async(req,res) => {
    const { categoryName, categoryImg, description, restaurantId} = req.body;
    console.log(req.params.id);

    try{
        const category = await Category.findById(req.params.id); 
        console.log(category);
        if(!category){
            res.status(404).json({status:404, error: "404", message:"Restaurant of given ID is not found"})
        }else{
        const updatecategory = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.status(200).json({status:200, error: "success", message:"Category updated successfully", updatecategory})
        return;
        }
    }catch(error){
        res.status(500).json({ status: 500, error: '500', message: 'Internal Server Error' });
    }
});


//Delete Category By Id

const deleteCategory = asyncHandler(async(req,res) => {
    try { 
        const category = await Category.findById(req.params.id);
        if(!category){
            res.status(404).json({status:404, error: "404", message:"Category of given ID is not found"})
        }else{

            const category = await Category.findByIdAndDelete(req.params.id);
            res.status(200).json({status:200, error: "success", message:"Category deleted successfully"})
        }
        
    } catch (error) {
        res.status(500).json({ status: 500, error: '500', message: 'Internal Server Error' });
    }
})

//getDataTableForCategoryByRestaurantId
const getDataTableForCategoryByRestaurantId = asyncHandler(async (req, res) => {
    const { search, length, start, order } = req.body;
    const restaurantId = req.params.id; // Extract restaurant ID from the URL parameter
    console.log('restaurantId', restaurantId)
    const recordPerPage = length;
    const searchData = search.value;
    let sort;
    let searchQuery = {
      restaurantId: restaurantId // Apply filter for the specific restaurant
    };
    
    if (searchData) {
      const regex = new RegExp(searchData, 'i');
      searchQuery = {
        ...searchQuery,
        $or: [
          { categoryName: regex },
          { description: regex}
        ]
      };
    }
  
    const totalRecords = await Category.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalRecords / length);
  
    let query = Category.find(searchQuery)
      .skip(start)
      .limit(length);
  
    // Add sorting logic if required
    const sortColumnIndex = order[0].column;
    const sortColumnDir = order[0].dir;
  
    // Determine the field to sort based on sortColumnIndex
    switch (sortColumnIndex) {
      case 0:
        sort = { categoryName: sortColumnDir };
        break;
      case 1:
        sort = { description: sortColumnDir };
        break;
      default:
        // If no valid sortColumnIndex is provided, you can set a default sorting option here.
        sort = { createdAt: 'asc' };
        break;
    }
  
    // Override the default sorting for descending direction
    if (sortColumnDir === 'desc') {
      const sortKeys = Object.keys(sort);
      sort = sortKeys.reduce((acc, key) => {
        acc[key] = -1;
        return acc;
      }, {});
    }
  
    query = query.sort(sort);
  
    const result = await query;
  
    res.status(200).json({
      recordPerPage,
      recordsTotal: totalRecords,
      recordsFiltered: totalRecords,
      totalPages,
      data: result
    });
  });


module.exports = {
    createCategory,
    getAllCategory,
    getCategoryById,
    editCategoryByCategoryId,
    deleteCategory,
    getDataTableForCategoryByRestaurantId,
    getCategoryByRestaurantId}