
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


//get Cart

const getCartById = asyncHandler(async(req, res) => {
 const cart = await Cart.find({User,Product})
 console.log(cart);
  if(!cart){
    res.status(404);
    throw new Error("Cart not Found");
  }
   
  res.status(200).json(cart);
})
  
  module.exports = { 
    addToCart,
    getCartById,
    removeFromCart
   };
  
  
 