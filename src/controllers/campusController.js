const express = require("express");
const asyncHandler = require("express-async-handler");
const moment = require("moment-timezone");
const mongoose = require("mongoose");
const Campus = require("../models/campusModel");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const createCampus = asyncHandler(async (req, res) => {
  const { campusName, location, description, createdBy } = req.body;

  try {
    const campus = await Campus.create({
      campusName,
      location,
      description,
      createdBy,
    });
    console.log("campus", campus);
    res.status(201).json({
      status: 201,
      error: "success",
      message: "Campus created successfully",
    });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ status: 500, error: "500", message: "Internal server error" });
    if (error.name === "ValidationError") {
      // Mongoose validation error
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      res.status(400).json({
        status: 400,
        error: "Validation Error",
        messages: validationErrors,
      });
    } else if (error.code === 11000) {
      // Mongoose unique constraint error (MongoError)
      const duplicateField = Object.keys(error.keyPattern)[0];
      console.log("duplicateField :", duplicateField);
      const message = `${duplicateField} already exists.`;
      res.status(409).json({ status: 409, error: "Conflict", message });
    } else {
      // Other types of errors (e.g., database connection errors)
      res.status(500).json({
        status: 500,
        error: "Server Error",
        message: "An error occurred while processing your request.",
      });
    }
  }
});

//Get All Campus
const getAllCampus = asyncHandler(async (req, res) => {
  const campus = await Campus.find();
  if (!campus) {
    res.status(404).json({
      status: 404,
      error: "404",
      message: "Campus of given ID is not found",
    });
    return;
  }
  res.status(200).json(campus);
});

//Get Campus By CampusId
const getCampusByCampusId = asyncHandler(async (req, res) => {
  try {
    const { campusId } = req.body;

    const campus = await Campus.findOne({ _id: campusId });
    if (!campus) {
      res.status(404).json({
        status: 404,
        error: "404",
        message: "Given campus Id is not Found",
      });
      return;
    }

    res.status(200).json(campus);
    console.log("campus", campus);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ ststus: 500, error: "500", message: "Internal server error" });
  }
});

//Get CampusBy User Id
const getCampusByUserId = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findOne({ _id: userId });
    console.log("user", user);
    console.log(userId);
    if (!user) {
      res.status(404).json({
        status: 404,
        error: "404",
        message: "Given User Id is not found",
      });
      return;
    }

    const campus = await Campus.find({ createdBy: userId });

    if (campus.length === 0) {
      res.status(404).json({
        status: 404,
        error: "404",
        message: "Campus of given User Id is not found",
      });
      return;
    }

    res.status(200).json(campus);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      error: "Server Error",
      message: "An error occurred while processing your request.",
    });
  }
});

//Get DropdownCampusByUserId

const getDropdownCampusByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId)) {
    res
      .status(400)
      .json({ status: 400, error: "400", message: "Invalid Admin Id" });
    return;
  }
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      res.status(404).json({
        status: 404,
        error: "404",
        message: "Given User Id is not found",
      });
      return;
    }

    const campus = await Campus.find({ createdBy: userId });
    console.log("campus", campus);

    if (campus.length === 0) {
      res.status(404).json({
        status: 404,
        error: "404",
        message: "Campus of given User Id is not found",
      });
      return;
    }

    const response = campus.map((campus) => ({
      _id: campus._id,
      campusName: campus.campusName,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      error: "Server Error",
      message: "An error occurred while processing your request.",
    });
  }
});

//editCampusByCampusId()
const editCampusByCampusId = asyncHandler(async (req, res) => {
  const { campusId, campusName, location, description, restaurantId } =
    req.body;

  if (!isValidObjectId(campusId)) {
    res
      .status(400)
      .json({ status: 400, error: "400", message: "Invalid Campus Id" });
    return;
  }

  try {
    const campus = await Campus.findOne({ _id: campusId });
    console.log("campus", campus);

    if (!campus) {
      res.status(404).json({
        status: 404,
        error: "404",
        message: "Campus of given ID is not found",
      });
      return;
    }

    const timezone = process.env.TIMEZONE;
    const currentDate = new Date();
    const utcOffset = moment.tz(timezone).utcOffset();
    currentDate.setUTCMinutes(currentDate.getUTCMinutes() + utcOffset);

    req.body.updatedAt = currentDate;

    const updateCampus = await Campus.findByIdAndUpdate(
      campusId, 
      req.body, 
      {new: true}
      );
    res.status(200).json({
      status: 200,
      error: "success",
      message: "Campus data updated successfully",
      updateCampus,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      error: "Server Error",
      message: "An error occurred while processing your request.",
    });
  }
});

//Get Data Table for Campus by User Id
const getDataTableForCampusByuserId = asyncHandler(async (req, res) => {
  const { search, length, start, order } = req.body;
  const userId = req.params.id; // Extract restaurant ID from the URL parameter
  console.log("userId", userId);
  const recordPerPage = length;
  const searchData = search.value;

  if (!isValidObjectId(req.params.id)) {
    res
      .status(400)
      .json({ status: 400, error: "Bad Request", message: "Invalid User Id" });
    return;
  }

  let sort;
  let searchQuery = {
    createdBy: userId, // Apply filter for the specific restaurant
  };

  if (searchData) {
    const regex = new RegExp(searchData, "i");
    searchQuery = {
      ...searchQuery,
      $or: [{ campusName: regex }],
    };
  }

  const totalRecords = await Campus.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalRecords / length);

  let query = Campus.find(searchQuery).skip(start).limit(length);

  // Add sorting logic if required
  const sortColumnIndex = order[0].column;
  const sortColumnDir = order[0].dir;

  // Determine the field to sort based on sortColumnIndex
  switch (sortColumnIndex) {
    case 0:
      sort = { campusName: sortColumnDir };
      break;
    case 1:
      sort = { location: sortColumnDir };
      break;
    case 2:
      sort = { description: sortColumnDir };
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

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
  createCampus,
  getAllCampus,
  getCampusByCampusId,
  getCampusByUserId,
  getDropdownCampusByUserId,
  getDataTableForCampusByuserId,
  editCampusByCampusId,
};
