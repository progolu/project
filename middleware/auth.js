const jwt = require('jsonwebtoken');
const User = require("../models/User");
const ErrorResponse = require('../utils/errorResponse');


// check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;

    if (!token) {
        return next(new ErrorResponse('You must log in to access this resource', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return next(new ErrorResponse('You must log in to access this resource', 401));
    }
};

// backend/middleware/authorize.js
exports.authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Access denied, Admins only' });
    }
    next();
  };




