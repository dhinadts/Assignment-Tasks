const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookingController');

router.post('/', ctrl.createBooking);
router.get('/:id', ctrl.getBookingStatus);
router.get('/seats/:showId', ctrl.getBookedSeatsForShow);
router.get('/booked', ctrl.getBookedSeatsForShow);


module.exports = router;
