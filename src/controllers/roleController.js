const express = require('express');
// const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Role = require('../models/roleModel');

const getAllRoles = asyncHandler(async (req, res) => {
    const role = await Role.find();
    if (role.length === 0) {
        res.status(404).json({ status: 404, error: 'Not Found', message: "No roles found" });
    } else {
        res.status(200).json(role);
    }

});


const createRole = asyncHandler(async (req, res) => {
    try {
        const { roleId, roleName } = req.body;
        const role = await Role.create({
            roleId,
            roleName
        });

        res.status(201).json({ status: 201, error: 'Created', message: "Role created successfully" });
    } catch (error) {
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


const updateRoleByRoleId = asyncHandler(async (req, res) => {
    const { roleName } = req.body;
    const id = req.params.id;
    console.log(id);
  
    const role = await Role.findOne({ roleId: id });
    console.log(role);
  
    if (!role) {
        res.status(404).json({ status: 404, error: '404', message: 'Role not found' });
      
    } else {
        const updatedRole = await Role.findByIdAndUpdate(
            role._id,
            { roleName }, 
            { new: true }
          );
            res.status(200).json({ status: 200, error: 'success', message: 'Role updated successfully'});
    }
  });
  
  


module.exports = {
    getAllRoles,
    createRole,
    updateRoleByRoleId
};