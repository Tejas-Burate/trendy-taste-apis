const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require("bcrypt");
const multer = require('multer');
const { StorageEngine } = multer;
const jwt = require('jsonwebtoken');
const logger = require('../middlewares/winstonLogger');



// Upload ProfileImg
 const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/profile');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
    },
});
  
  const upload = multer({ storage });
  
  const uploadProfileImg = (req, res) => {
    console.log(req.file);
    if (!req.file) {
      console.log(req.file);
      res.status(400).json({status:400, error: '400', message: 'No file uploaded'});
    } else {
      // const imageUrl = `${req.protocol}://${req.get('host')}/images/profile/${req.file.filename}`;
      const imageUrl = `https://trendy-taste-a7jv.onrender.com/images/profile/${req.file.filename}`;
      res.status(200).json({status:200,error:'success',message:'imageUrl created', imageUrl });
    }
  };
  

  // Genarte random OTP number
function generateOTP() {
  const min = 1000; // Minimum 4-digit number (1000)
  const max = 9999; // Maximum 4-digit number (9999)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


//Create User
const createUser = asyncHandler(async (req, res) => {
  try {
    const otp = generateOTP();
    const { fullName, email, password, mobile, roleId, profileImg, createdBy } = req.body;
    let hashedPassword = null;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      profileImg,
      otp,
      roleId : 0,
      createdBy
    });

    res.status(201).json({ status: 201, error: "success", message: "User created successfully" });
  } catch (error) {
    console.log('error', error);

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
});


//Create Admin
const createAdmin = asyncHandler(async (req, res) => {
  try {
    const otp = generateOTP();
    const { fullName, email, password, mobile, profileImg, createdBy } = req.body;
    let hashedPassword = null;

    if (!isValidObjectId(req.body.createdBy)) {
      res.status(400).json({ status: 400, error: "400", message: "Invalid Admin Id" });
      return;
    }

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      profileImg,
      otp,
      roleId : 2,
      createdBy
    });

    res.status(201).json({ status: 201, error: "success", message: "Admin created successfully" });
  } catch (error) {
    console.log('error', error)
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
});


// Create Restaurant Manager
const createRestaurantManager = asyncHandler(async (req, res) => {
  try {
    const otp = generateOTP();
    const { fullName, email, password, mobile, profileImg, createdBy } = req.body;
    let hashedPassword = null;
    if (!isValidObjectId(req.body.createdBy)) {
      res.status(400).json({ status: 400, error: "400", message: "Invalid Admin Id" });
      return;
    }

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      profileImg,
      otp,
      roleId : 1,
      createdBy
    });

    res.status(201).json({ status: 201, error: "success", message: "Restaurant Manager created successfully" });
  } catch (error) {
    console.log('error', error)
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
});


//Edit Restaurant Managaer By User Id(Admin Id)

const editRestaurantManagerByUserId = asyncHandler(async(req,res) => {
  const { fullName, email, password, mobile, profileImg } = req.body;
  if (!isValidObjectId(req.params.id)) {
    res.status(400).json({ status: 400, error: "400", message: "Invalid Admin Id" });
    return;
  }

  try{
  const user = await User.findOne({createdBy : req.body.id});
  console.log('user', user)
  if(!user){
    res.status(404).json({status:404, error: "404", message: "Given Admin Id is not found"});
    return;
  }
   const updateRestaurantManager = await User.findByIdAndUpdate(
                           req.params.id,
                           req.body,
                           {new: true}
                          );

   res.status(200).json({message: "data updated successfully", updateRestaurantManager});
  }catch(error){
    console.log(error);
    res.status(500).json({ status: 500, error: 'Server Error', message: 'An error occurred while processing your request.' });
  }
});


//Edit Admin By User Id(Admin Id)
const editAdminByUserId = asyncHandler(async(req,res) => {
  const { fullName, email, password, mobile, profileImg } = req.body;
  if (!isValidObjectId(req.params.id)) {
    res.status(400).json({ status: 400, error: "400", message: "Invalid Admin Id" });
    return;
  }

  try{
  const user = await User.findOne({createdBy : req.body.id});
  console.log('user', user)
  if(!user){
    res.status(404).json({status:404, error: "404", message: "Given Admin Id is not found"});
    return;
  }
   const updateAdmin = await User.findByIdAndUpdate(
                           req.params.id,
                           req.body,
                           {new: true}
                          );

   res.status(200).json({message: "data updated successfully", updateAdmin});
  }catch(error){
    console.log(error);
    res.status(500).json({ status: 500, error: 'Server Error', message: 'An error occurred while processing your request.' });
  }
})



//Get All Restaurant Manager 

const getRestaurantManager = asyncHandler(async (req, res) => {
  try {
    const restaurantManager = await User.find({ roleId: 1 });
    console.log('restaurantManager', restaurantManager);

    if (restaurantManager.length === 0) {
      return res.status(404).json({ status: 404, error: "404", message: "Restaurant Manager not found" });
    }

    res.status(200).json(restaurantManager);
  } catch (error) {
    res.status(500).json({ status: 500, error: '500', message: 'Internal Server Error' });
  }
});


//Get All Admins RoleId-1
const getAdmin = asyncHandler(async (req, res) => {
  try {
    const admin = await User.find({ roleId: 2 });
    console.log('admin', admin);

    if (admin.length === 0) {
      return res.status(404).json({ status: 404, error: "404", message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ status: 500, error: '500', message: 'Internal Server Error' });
  }
});



//Get All Users
  const getAllUsers = asyncHandler(async (req, res) => {
    try {
      const users = await User.find({roleId : 0});
      console.log(users);
  
      if (users.length === 0) {
        res.status(404).json({ status: 404, error: '404', message: 'User not found' });
      } else {
        
        res.status(200).json(users);
      }
    } catch (error) {
      // Error while fetching users
      logger.error(`${req.method} ${req.url} - Error while fetching users: ${error.message}`);
      res.status(500).json({ status: 500, error: '500', message: 'Internal Server Error' });
    }
  });
  

  //Delete User 

  const deleteUser = asyncHandler(async(req,res) =>{
    try{
    const user = await User.findOne(req.params.id);
    if(!user){
      res.status(404).json({status:404, error:"success", message:"User not found of given Id"});
    }
    let deleteuser = await User.findByIdAndDelete(req.params.id)
    res.status(200).json({status:200, error: "success", message:"User deleted successfully"})
  }catch(error){
    res.status(500).json({ status: 500, error: '500', message: 'Internal Server Error' });
  }
  }) 
  

const updateProfile = asyncHandler(async (req, res, next) => {
  const { profileImg } = req.body;

  let token;
  let authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    console.log(token);
    try {
      const decode = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
      console.log("Decoded", decode);
      const user = await User.findOne({ email: decode.email });
      console.log(user);
      if (user) {
        // Update the user's profileImg field with the new value
        user.profileImg = req.body.profileImg; // Change from req.profileImg to req.body.profileImg
        await user.save(); // Save the updated user document to the database

        // Respond with the updated user object
        res.status(200).json({ status: 200, message: "Profile image updated successfully", user });
      } else {
        res.status(404).json({ status: 404, error: "User not found", message: "User is not authorized" });
      }
    } catch (error) {
      res.status(401).json({ status: 401, error: "Unauthorized", message: "User is not authorized" });
    }
  } else {
    res.status(401).json({ status: 401, error: "Unauthorized", message: "User is not authorized" });
  }
});

//Get DataTable for product

//CategoryDataTable

const getUserDataTable = asyncHandler(async (req, res) => {
  const { search, length, start, order } = req.body;
  const recordPerPage = length;
  const searchData = search.value;
  const dataOrder = order.value;
  let sort;
  let searchQuery = {};
  
  if (searchData) {
    const regex = new RegExp(searchData, 'i');
    searchQuery = {
      $or: [
        { fullName: regex },
        { email: regex }
      ]
    };
  }

  const totalRecords = await User.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalRecords / length);

  console.log(searchQuery);
  let query = User.find(searchQuery)
    .skip(start)
    .limit(length);

  // Add sorting logic if required
  const sortColumnIndex = order[0].column;
  const sortColumnDir = order[0].dir;

  // Determine the field to sort based on sortColumnIndex
  switch (sortColumnIndex) {
    case 0:
      sort = { roleId: sortColumnDir };
      break;
    case 1:
      sort = { rollName: sortColumnDir };
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

//

const getDataTableForRestaurantManagerByRestaurantId = asyncHandler(async (req, res) => {
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
        { fullName: regex }
      ]
    };
  }

  const totalRecords = await Product.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalRecords / length);

  let query = Product.find(searchQuery)
    .skip(start)
    .limit(length);

  // Add sorting logic if required
  const sortColumnIndex = order[0].column;
  const sortColumnDir = order[0].dir;

  // Determine the field to sort based on sortColumnIndex
  switch (sortColumnIndex) {
    case 0:
      sort = { productName: sortColumnDir };
      break;
    case 1:
      sort = { categoryId: sortColumnDir };
      break;
    case 2:
      sort = { price: sortColumnDir };
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

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

module.exports = {
        createUser, 
        createRestaurantManager,
        createAdmin,
        editRestaurantManagerByUserId,
        editAdminByUserId,
        getAllUsers,
        getAdmin,
        getRestaurantManager,
        uploadProfileImg,
        upload,
        updateProfile,
        getUserDataTable,
        deleteUser
      }