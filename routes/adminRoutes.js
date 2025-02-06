// backend/routes/adminRoutes.js
const express = require('express');
const { 
    getAllAdmin,
    getAllUsers,
    getAllShippers,
    getAllCarriers,
    changeUserRole } = require('../controllers/adminController');
    const { isAuthenticated, authorizeAdmin } = require("../middleware/auth");

const router = express.Router();

router.post('/changerole',isAuthenticated, authorizeAdmin, changeUserRole);
 router.get('/allusers',isAuthenticated, authorizeAdmin, getAllUsers);
 router.get('/allshipper',isAuthenticated, authorizeAdmin, getAllShippers);
 router.get('/allcarrier', isAuthenticated, authorizeAdmin,getAllCarriers);
 router.get('/alladmin', isAuthenticated, authorizeAdmin,getAllAdmin);

module.exports = router;
