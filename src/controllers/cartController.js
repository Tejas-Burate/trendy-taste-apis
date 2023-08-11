
const express = require('express');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');




// Add Cart
const addToCart = asyncHandler(async (req, res) => {
  const { userId, productId } = req.body;

  const compCart = await Cart.find({ userId, productId });
  const user = await User.findById(userId);
  const product = await Product.findById(productId);
  
  // Validating userId and productId
  if (!user || !product) {
    res.status(400);
    throw new Error("Invalid userID or productID");
  }

  if (compCart.length > 0) {
    const cart = compCart[0];
    cart.quantity += 1;
    await cart.save();
    res.status(200).json(cart);
  } else {
    const cart = await Cart.create({
      userId,
      productId,
      quantity: 1
    });
    res.status(201).json({ message: "Cart is created", cart });
  }
});



//Remove from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { userId, productId } = req.body;

  const compCart = await Cart.find({ userId, productId });
  const user = await User.findById(userId);
  const product = await Product.findById(productId);
  
  // Validating userId and productId
  if (!user || !product) {
    res.status(400);
    throw new Error("Invalid userID or productID");
  }

  if (compCart.length > 0) {
    const cart = compCart[0];
    cart.quantity -= 1;
    await cart.save();
    res.status(200).json(cart);
  } else {
    const cart = await Cart.create({
      userId,
      productId,
      quantity: 1
    });
    res.status(201).json({ message: "Cart is created", cart });
  }
});


//Get Cart
const getCart = asyncHandler(async(req, res) => {
  try{
 const cart = await Cart.find();
 console.log(cart);
  if(cart.length === 0){
    res.status(404).json({status: 404, error: "404", message: " Cart  Not Found"});
  }
   
  res.status(200).json({status: 200, error: "success", message: " ",cart});
}catch(error){
  console.log('error', error);
  res.status(500).json({status: 500, error: "500", message: "Internal Server Error"});
}
})


//get Cart By User ID

const getCartByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  let totalRecords = 0;
  let totalAmount = 0;

  try {
    const cart = await Cart.find({ userId: req.body.userId });
    if (!cart || cart.length === 0) {
      return res.status(404).json({ status: 404, error: "404", message: "Cart of Given User Id is Not Found" });
    }

    const cartWithProducts = [];

    for (const cartItem of cart) {
      const product = await Product.findById(cartItem.productId);
      if (product) {
        totalRecords += 1;
        totalAmount += product.price * cartItem.quantity;

        // Include product details in the cart item
        const productDetails = {
          _id: product._id,
          productName: product.productName,
          productImg: product.productImg,
          price: product.price,
          description: product.description,
          status: product.status,
          categoryId: product.categoryId,
        };

        const cartItemWithProduct = {
          _id: cartItem._id,
          quantity: cartItem.quantity,
          productDetails, // Include the product details
        };

        cartWithProducts.push(cartItemWithProduct);
      }
    }

    // Include the totalRecords and totalAmount in the response
    res.status(200).json({
      status: 200,
      userId,
      totalRecords,
      totalAmount,
      products: cartWithProducts,
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ status: 500, error: "500", message: "Internal Server Error" });
  }
});

  module.exports = { 
    addToCart,
    getCartByUserId,
    getCart,
    removeFromCart
   };
  
  
 