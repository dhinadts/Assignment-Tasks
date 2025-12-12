const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/showController');

router.get('/', ctrl.getShows);
router.get('/:id/seats', ctrl.getSeats);

module.exports = router;
