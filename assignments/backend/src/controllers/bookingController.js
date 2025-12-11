const bookingService = require('../services/bookingService');
const bookingModel = require('../models/bookingModel');

module.exports = {
    createBooking: async (req, res) => {
        try {
            const { userId, showId, seatNumbers } = req.body;

            const result = await bookingService.bookSeats(userId, showId, seatNumbers);

            if (result.error)
                return res.status(409).json({ status: 'FAILED', message: 'Some seats unavailable' });

            res.json(result);
        } catch {
            res.status(500).json({ error: 'internal' });
        }
    },

    getBookingStatus: async (req, res) => {
        const r = await bookingModel.getBooking(req.params.id);
        if (r.rows.length === 0)
            return res.status(404).json({ error: 'not found' });

        res.json(r.rows[0]);
    }
};
