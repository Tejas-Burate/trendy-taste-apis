const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const Restaurant = require("../models/restaurantModel");
const moment = require("moment-timezone");

//Create Product
const createProduct = asyncHandler(async (req, res) => {
  const {
    productName,
    productImg,
    price,
    status,
    description,
    restaurantId,
    categoryId,
  } = req.body;

  try {
    const product = await Product.create({
      productName,
      productImg,
      price,
      status,
      description,
      restaurantId,
      categoryId,
    });
    res
      .status(201)
      .json({
        status: 201,
        error: "success",
        message: "Product created successfully",
      });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Mongoose validation error
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      res
        .status(400)
        .json({
          status: 400,
          error: "Validation Error",
          messages: validationErrors,
        });
    } else if (error.code === 11000) {
      // Mongoose unique constraint error (MongoError)
      const duplicateField = Object.keys(error.keyPattern)[0];
      const message = `${duplicateField} already exists.`;
      res.status(409).json({ status: 409, error: "Conflict", message });
    } else {
      // Other types of errors (e.g., database connection errors)
      res
        .status(500)
        .json({
          status: 500,
          error: "Server Error",
          message: "An error occurred while processing your request.",
        });
    }
  }
});

//Get All Products
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find();

    if (product.length === 0) {
      res
        .status(404)
        .json({ status: 404, error: "400", message: "Products are not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal Server Error" });
  }
});

//Get product By ID
const getProductById = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      res
        .status(404)
        .json({
          status: 404,
          error: "400",
          message: "Product of given Id is not found",
        });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal Server Error" });
  }
});

//Get Product By Restaurant Id
const getProductsByRestaurantId = asyncHandler(async (req, res) => {
  const { restaurantId } = req.body;

  if (!isValidObjectId(restaurantId)) {
    res
      .status(400)
      .json({ status: 400, error: "400", message: "Invalid Admin Id" });
    return;
  }
  try {
    const restaurant = await Restaurant.findOne({ _id: restaurantId });
    if (!restaurant) {
      res
        .status(404)
        .json({
          status: 404,
          error: "404",
          message: "Given Restaurant Id is not found",
        });
      return;
    }

    const product = await Product.find({ restaurantId: restaurantId });
    if (product.length === 0) {
      res
        .status(404)
        .json({
          status: 404,
          error: "404",
          message: "Product of Given Restaurant Id is not found",
        });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal Server Error" });
  }
});

// Update Product By ID
const editProductByProductId = asyncHandler(async (req, res) => {
  const { productId, productName, productImg, price, restaurantId, categoryId } = req.body;

  try {
    const product = await Product.findById(productId);
    console.log("product", product);

    if (!product) {
      res
        .status(404)
        .json({
          status: 404,
          error: "404",
          message: "Product of given Id is not found",
        });
      return;
    }

  const timezone = process.env.TIMEZONE;
  const currentDate = new Date();
  const utcOffset = moment.tz(timezone).utcOffset();
  currentDate.setUTCMinutes(currentDate.getUTCMinutes() + utcOffset);
  req.body.updatedAt = currentDate;

    const updateproduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );
    res.status(200).json(updateproduct);
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal Server Error" });
  }
});

//Delete product by Id

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res
        .status(404)
        .json({
          status: 404,
          error: "404",
          message: "Product of given Id is not found",
        });
      return;
    }
    const deleteproduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal Server Error" });
  }
});

//  getDataTableForProductByRestaurantId

const getDataTableForProductByRestaurantId = asyncHandler(async (req, res) => {
  const { search, length, start, order } = req.body;
  const restaurantId = req.params.id; // Extract restaurant ID from the URL parameter
  console.log("restaurantId", restaurantId);
  const recordPerPage = length;
  const searchData = search.value;
  let sort;
  let searchQuery = {
    restaurantId: restaurantId, // Apply filter for the specific restaurant
  };

  if (searchData) {
    const regex = new RegExp(searchData, "i");
    searchQuery = {
      ...searchQuery,
      $or: [{ productName: regex }],
    };
  }

  const totalRecords = await Product.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalRecords / length);

  let query = Product.find(searchQuery).skip(start).limit(length);

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
      sort = { createdAt: "asc" };
      break;
  }

  // Override the default sorting for descending direction
  if (sortColumnDir === "desc") {
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
    data: result,
  });
});

//Function for checking valid objectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
  createProduct,
  getAllProduct,
  getProductsByRestaurantId,
  getDataTableForProductByRestaurantId,
  editProductByProductId,
  deleteProduct,
  getProductById,
};
