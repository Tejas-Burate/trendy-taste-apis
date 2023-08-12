const express = require('express');
const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Razorpay = require('../controllers/razorpayIntegrationController');

//Create 
const placeOrder = asyncHandler(async (req, res) => {
  const {
      userId,
      currency,
      scheduleDate,
      scheduleTime,
      totalAmount,
      products,
      paidAmount,
      remainingAmount,
      rPaymentId,
      rOrderId,
      rSignature
  } = req.body;

  try {
      const order = await Order.create({
          userId,
          currency,
          scheduleDate,
          scheduleTime,
          totalAmount,
          products: products.map(product => ({
              productId: product._id, // Assuming this is the ID of the product
              productName: product.productDetails.productName,
              quantity: product.quantity,
              price: product.productDetails.price,
              description: product.productDetails.description,
              status: product.productDetails.status,
              categoryId: product.productDetails.categoryId,
          })),
          paidAmount,
          remainingAmount,
          rPaymentId,
          rOrderId,
          rSignature
      });

      // Replace these with actual values

      const amount = totalAmount;
      Razorpay.orders.create({ amount, currency, }, (err, razorpayOrder) => {
          if (!err) {
            const key_id = 'rzp_test_4cWB86mbFXsYF3';
              console.log('Razorpay order:', razorpayOrder);
              // You might want to store the Razorpay order ID in your database here
              res.status(201).json({
                  status: 201,
                  error: "success",
                  message: "Order created successfully",
                  // order: order,
                  key_id,
                  razorpayOrder: razorpayOrder, // Send the Razorpay order details back to the client
              });
          } else {
              console.log('Razorpay error:', err);
              res.status(500).json({
                  status: 500,
                  error: "Razorpay Error",
                  message: "An error occurred while creating the Razorpay order.",
                  razorpayError: err, // Send the Razorpay error details back to the client
              });
          }
      });
  } catch (error) {
      console.log('Error:', error);
      res.status(500).json({
          status: 500,
          error: "Server Error",
          message: "An error occurred while processing your request.",
      });
  }
});

//Payment Status

// const paymentStatus = asyncHandler(async(req,res) => {
// const {
//   dbOrderId, 
//   razorpay_payment_id, 
//   razorpay_order_id, 
//   razorpay_signature, 
//   userId} = req.body;

//   const order = await Order.findOne({_id : dbOrderId});
//   if(!order){
//     res.status(404).json({status:404, error:"404", message:"Order of given OrderID is not found"});
//     return;
//   }

//   const orderUpdate = await Order.findByIdAndUpdate(
//     req.params.id,
//     order.
//     {new:true}
//   )

// })




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
        const {userId} = req.body;

        const user = await User.findOne({_id : userId});
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
  placeOrder,
  getAllOrders, 
  getOrderByUserId }