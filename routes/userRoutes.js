// backend/routes/userRoutes.js
const express = require('express');
const {registerAdmin, logout,registerUser, loginUser  } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/admin/register', registerAdmin);
router.post('/login', loginUser);
router.get('/user/logout', logout);

module.exports = router;





