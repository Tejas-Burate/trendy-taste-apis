const express = require('express');
const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const User = require('../models/userModel');

//Create 
const createOrder = asyncHandler(async (req, res) => {
  const { userId, restaurantId, products } = req.body;

  try {
    const order = await Order.create({
      userId,
      restaurantId,
      products,
    });

    console.log(order);
    res.status(201).json({
      status: 201,
      error: "success",
      message: "Order created successfully",
      order: order, // Optionally, you can include the created order in the response
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Mongoose validation error
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      res.status(400).json({ status: 400, error: "Validation Error", messages: validationErrors });
    } else if (error.code === 11000) {
      // Mongoose unique constraint error (MongoError)
      const duplicateField = Object.keys(error.keyPattern)[0];
      const message = `${duplicateField} already exists.`;
      res.status(409).json({ status: 409, error: "Conflict", message });
    } else {
      // Other types of errors (e.g., database connection errors)
      res.status(500).json({ status: 500, error: "Server Error", message: "An error occurred while processing your request." });
    }
  }
});




//Get All Orders

const getAllOrders = asyncHandler(async(req,res) => {
    try {
        const order = await Order.find();
        if(order.length === 0){
            res.status(404).json({status:404, error: "404" ,message:"Orders are not found"})
        return;
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ status: 500, error: 'Server Error', message: 'An error occurred while processing your request.' });
    }
})

//Get Order By User Id

const getOrderByUserId = asyncHandler(async(req,res) => {
    try {
        const user = await User.findOne({_id : req.params.id});
        if(!user ){
            res.status(404).json({status:404, error: "404", message: "User of given Id is not found"});
            return;
        }

        const order = await Order.find({userId : user._id});
        if(order.length === 0){
            res.status(404).json({status:404, error: "404", message: "Order  of given userId is not found"});
            return;
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ status: 500, error: 'Server Error', message: 'An error occurred while processing your request.' });
    }
})

module.exports = { 
    createOrder,
    getAllOrders, 
    getOrderByUserId }