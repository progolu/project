// backend/controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = [
  async (req, res) => {
    try {

      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password, 
      });

      await user.save();
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error });
    }
  },
];

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    const newAdmin = new User({
      name,
      email,
      password,
      role: 'Admin',
    });

    await newAdmin.save();

    res.status(201).json({ success: true, message: 'Admin registered successfully',newAdmin });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id , role: user.role,}, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};
const generateToken = async (user, statusCode, res) => {

  const token = await user.jwtGenerateToken();

  const options = {
      httpOnly: true,
      expiresIn:  '1h',
  };

  res
      .status(statusCode) 
      .cookie('token', token, options)
      .json({ success: true, token,user })
}


  exports.getUserProfile = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming user ID is available from authenticated token
      const user = await User.findById(userId).select('-password'); // Exclude password from the response
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User profile retrieved successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user profile', error });
    }
  };

// Get Single User by ID or Username
exports.singleUser = async (req, res) => {
  try {
    const { id, username } = req.params;
    
    const user = await User.findOne(id ? { _id: id } : { username: username }).select('-password'); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User found successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

exports.updateUser = [

  async (req, res) => {
    try {
      console.log(req.user); 
      
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
      }

      const userId = req.user.id; 

      const updatedData = {
    
        name: req.body.username,
        email: req.body.email,
      };

      const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        message: 'User updated successfully',
        user, 
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating user',
        error: error.message,
      });
    }
  },
];



exports.logout = (req, res) => {
  // Clear the token cookie
  res.clearCookie('token', {
    httpOnly: true, // ensure cookie is not accessible via client-side scripts
    //secure: process.env.NODE_ENV === 'production', // send only over HTTPS in production
    //sameSite: 'strict', // protect against CSRF
  });

  // Send a response confirming logout
  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
};
