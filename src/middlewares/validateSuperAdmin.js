const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const validateSuperAdmin = asyncHandler(async(req, res, next) => {
    let token;
    let authHeader = req.headers.authorization;

    if(!authHeader){
        res.status(401).json({status: 401, error: 401, message: "Bearer token is required" });
        return;
    }

    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        console.log(token);
        try{
            const decode = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
            console.log("Decoded", decode);
            const user = await User.findOne({email : decode.email});
            console.log(user);
            if(user && user.roleId !== 3){
                res.status(401).json({status: 401, error: 401, message: "User is not authorized" });    
            }
            next();
        }catch(err){
            res.status(401).json({status: 401, error: 401, message: "User is not authorized" });
        }
    }
});

module.exports = validateSuperAdmin;