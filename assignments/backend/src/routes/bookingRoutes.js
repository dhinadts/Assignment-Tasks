const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookingController');

router.post('/', ctrl.createBooking);
router.get('/:id', ctrl.getBookingStatus);

module.exports = router;
