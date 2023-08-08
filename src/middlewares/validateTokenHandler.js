const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization;

  if(!authHeader){
    res.status(401).json({status: 401, error: 401, message: "Bearer token is required" });
    return;
}

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    try {
        console.log("Token:", token);
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        console.log("Decoded:", decoded);
        req.user = decoded.user;
        next();
      } catch (err) {
      res.status(401).json({status: 401, error: "401", message: "Invalid Token" });
    }
  } else {
    res.status(401).json({status: 401, error: "401", message: "User is not authorized" });
  }
});

module.exports = validateToken;
