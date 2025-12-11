const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/shows', adminController.createShow);

module.exports = router;
