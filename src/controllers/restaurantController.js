const express = require('express');
const mongoose = require('mongoose');
const moment = require("moment-timezone");
const Restaurant = require('../models/restaurantModel');
const Campus = require('../models/campusModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const { StorageEngine } = multer;


//create a new restaurant

const createRestaurant = asyncHandler(async(req,res) => {
    const { restaurantName, location, restaurantImg, campusId, createdBy } = req.body;
try{
     const restaurant = await Restaurant.create({
        restaurantName,
        location,
        restaurantImg,
        campusId, 
        createdBy
    })
    res.status(201).json({status:201, error:"success", message: "Restaurant created successfully",restaurant});
}catch(error){
    console.log(error);

    if (error.name === 'ValidationError') {
        // Mongoose validation error
        const validationErrors = Object.values(error.errors).map(err => err.message);
        res.status(400).json({ status: 400, error: 'Validation Error', messages: validationErrors });
    } else if (error.code === 11000) {
        // Mongoose unique constraint error (MongoError)
        const duplicateField = Object.keys(error.keyPattern)[0];
        console.log("duplicateField :",duplicateField);
        const message = `${duplicateField} already exists.`;
        res.status(409).json({ status: 409, error: 'Conflict', message });
    } else {
        // Other types of errors (e.g., database connection errors)
        res.status(500).json({ status: 500, error: 'Server Error', message: 'An error occurred while processing your request.' });
    }
   }    
});

//Get All restaurants 
const getAllRestaurants = asyncHandler(async(req,res) => {
    try{
    const restaurant = await Restaurant.find();
    console.log(restaurant);
    if(restaurant.length === 0){
        res.status(404).json({ status: 404, error: '404', message: 'Restaurant not found' });
    }else{
        res.status(200).json({status:200, error:"success", message: "Successfully get all restaurants", restaurant})
    }
    }catch(error){
        res.status(500).json({ status: 500, error: '500', message: 'Internal Server Error' });
    }
})

//Get Restaurant By Id
const getRestaurantById = asyncHandler(async(req,res) => {
  const { restaurantId } = req.body
    try {
        if (!isValidObjectId(restaurantId)) {
            res.status(400).json({ status: 400, error: "Bad Request", message: "Invalid Restaurant Id" });
            return;
          }

        const restaurant = await Restaurant.findOne({_id : restaurantId});
        if(!restaurant){
            res.status(404).json({status:404, error: "400", message: "Restaurant of given Id is not found"});
            return;
        }
        res.status(200).json(restaurant);
        
    } catch (error) {
      console.log('error', error);
        res.status(500).json({status:500, error: "500", message:"Internal Server Error"});
    }
})


//Get Restaurant By Campus ID

const getRestaurantByCampusId = asyncHandler(async (req, res) => {
    try {
       const { campusId } = req.body;
      
      if (!isValidObjectId(campusId)) {
        res.status(400).json({ status: 400, error: "Bad Request", message: "Invalid Campus Id" });
        return;
      }
  
      const campus = await Campus.findOne({ _id: campusId });
      console.log('campus', campus);
  
      if (!campus) {
        res.status(404).json({ status: 404, error: "Not Found", message: "Campus of given Id is not found" });
        return;
      }
  
      const restaurant = await Restaurant.find({ campusId });
      if (restaurant.length === 0) {
        res.status(404).json({ status: 404, error: "Not Found", message: "Restaurant of given campusId is not found" });
        return;
      }
  
      res.status(200).json(restaurant);
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ status: 500, error: "Internal Server Error", message: "An error occurred while processing your request." });
    }
  });
  
  


//Get Restaurant By User Id
const getRestaurantByUserId = asyncHandler(async (req, res) => {
    try {
      const { userId } = req.body;

        if (!isValidObjectId(userId)) {
            res.status(400).json({ status: 400, error: "Bad Request", message: "Invalid User Id" });
            return;
          }

      const user = await User.findOne({ _id: userId });
      console.log('user', user);
  
      if (!user) {
        res.status(404).json({ status: 404, error: "404", message: "Invalid user Id" });
        return;
      }
  
      const restaurant = await Restaurant.find({ createdBy : userId });
      if (restaurant.length === 0) {
        res.status(404).json({ status: 404, error: "404", message: "Restaurant of given User Id is not found" });
        return;
      }
  
      res.status(200).json(restaurant);
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ status: 500, error: "500", message: "Internal Server Error" });
    }
  });



//update restaurant
const editRestaurantByRestaurantId = asyncHandler(async(req,res) => {
    const { restaurantId , restaurantName, location, restaurantImg } = req.body;

    try{
        const restaurant = await Restaurant.findById(restaurantId); 
        console.log(restaurant);
        if(!restaurant){
            res.status(404).json({status:404, error: "404", message:"Restaurant of given ID is not found"})
        }else{

          const timezone = process.env.TIMEZONE;
  const currentDate = new Date();
  const utcOffset = moment.tz(timezone).utcOffset();
  currentDate.setUTCMinutes(currentDate.getUTCMinutes() + utcOffset);
  req.body.updatedAt = currentDate;

        const restaurant = await Restaurant.findByIdAndUpdate(
          restaurantId,
            req.body,
            {new: true}
        );

        res.status(200).json({status:200, error: "success", message:"Resaturant updated successfully", restaurant})
        }
    }catch(error){
      console.log('error', error);
        res.status(500).json({ status: 500, error: '500', message: 'Internal Server Error' });
    }
});

//delete restaurant
const deleteRestaurant = asyncHandler(async(req,res) => {
    try { 
        const restaurant = await Restaurant.findById(req.params.id);
        if(!restaurant){
            res.status(404).json({status:404, error: "404", message:"Restaurant of given ID is not found"})
        }else{

            const deleteRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
            res.status(200).json({status:200, error: "success", message:"Resaturant deleted successfully"})
        }
        
    } catch (error) {
        res.status(500).json({ status: 500, error: '500', message: 'Internal Server Error' });
    }
})


//Upload restaurant Image
// Upload ProfileImg
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/restaurant');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
    },
});
  
  const upload = multer({ storage });
  
  const uploadRestaurantImg = (req, res) => {
    console.log(req.file);
    if (!req.file) {
      console.log(req.file);
      res.status(400).json({status:400, error: '400', message: 'No file uploaded'});
    } else {
      console.log('in if condition');
      const imageUrl = `${req.protocol}://${req.get('host')}/images/restaurant/${req.file.filename}`;
      res.status(200).json({status:200,error:'success',message:'imageUrl created', imageUrl });
    }
  };

//Get Datatable for restaurant By campus Id

const getDataTableForRestaurantBycampusId = asyncHandler(async (req, res) => {
  const { search, length, start, order } = req.body;
  const campusId = req.params.id; // Extract restaurant ID from the URL parameter
  console.log('campusId', campusId)
  const recordPerPage = length;
  const searchData = search.value;

  if (!isValidObjectId(campusId)) {
    res.status(400).json({ status: 400, error: "Bad Request", message: "Invalid Campus Id" });
    return;
  }
  let sort;
  let searchQuery = {
    campusId: campusId // Apply filter for the specific restaurant
  };
  
  if (searchData) {
    const regex = new RegExp(searchData, 'i');
    searchQuery = {
      ...searchQuery,
      $or: [
        { restaurantName: regex }
      ]
    };
  }

  const totalRecords = await Restaurant.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalRecords / length);

  let query = Restaurant.find(searchQuery)
    .skip(start)
    .limit(length);

  // Add sorting logic if required
  const sortColumnIndex = order[0].column;
  const sortColumnDir = order[0].dir;

  // Determine the field to sort based on sortColumnIndex
  switch (sortColumnIndex) {
    case 0:
      sort = { restaurantName: sortColumnDir };
      break;
    case 1:
      sort = { location: sortColumnDir };
      break;
    // Add more cases for other columns if needed
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


  //Function for checking valid objectId
  
  function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  } 

module.exports = { 
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    getRestaurantByCampusId,
    getDataTableForRestaurantBycampusId,
    getRestaurantByUserId,
    editRestaurantByRestaurantId,
    deleteRestaurant,
    uploadRestaurantImg,
    upload
 }