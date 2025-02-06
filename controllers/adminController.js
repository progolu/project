const User = require('../models/User');

// Get all users (admin access)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['Shipper', 'Carrier'] } });
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllAdmin = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['Admin'] } });
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllShippers = async (req, res) => {
  try {
    const shippers = await User.find({ role: 'Shipper' });
    res.status(200).json({ success: true, data: shippers });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllCarriers = async (req, res) => {
  try {
    const carriers = await User.find({ role: 'Carrier' });
    res.status(200).json({ success: true, data: carriers });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

 exports.changeUserRole = async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['Shipper', 'Carrier'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role provided' });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      user.role = role;
      await user.save();
  
      res.status(200).json({ success: true, message: 'User role updated successfully', data: user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
};