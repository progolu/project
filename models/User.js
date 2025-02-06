// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Shipper', 'Carrier'], default: 'Shipper' },
},{ timestamps: true });


userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
      next()
    }
    this.password = await bcrypt.hash(this.password, 10);
  });

// verify passwordd
userSchema.methods.comparePassword = async function (yourPassword) {
    return await bcrypt.compare(yourPassword, this.password);
  }
  
  // get the token
  userSchema.methods.jwtGenerateToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
      expiresIn: 3600
    });
  }

const User = mongoose.model('User', userSchema);

module.exports = User;
