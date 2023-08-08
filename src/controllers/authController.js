const express = require('express');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const bcrypt = require("bcrypt");
const User = require('../models/userModel');


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ status: 400, error: '400', message: 'All fields required' });
      return;
    }
  
    const user = await User.findOne({ email });
    console.log(user);
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                email: user.email
            },
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: "20m" }
          );
      
        //   res.status(200).json({ accessToken });
        //   return;
      res.status(200).json({ status: 200, error: 'success', message: "User Login Successfully", 'accessToken': accessToken });
    } else {
      res.status(400).json({ status: 400, error: 'Validation Error', message: 'Invalid email or password' });
    }
});

module.exports = {loginUser}

//forget password


//logout