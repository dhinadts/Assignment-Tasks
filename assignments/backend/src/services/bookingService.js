const { v4: uuid } = require('uuid');
const pool = require('../config/db');
const bookingModel = require('../models/bookingModel');
const bookingItemModel = require('../models/bookingItemModel');
const seatService = require('./seatService');

module.exports = {
    bookSeats: async (userId, showId, seatNumbers) => {
        const client = await pool.connect();
        const bookingId = uuid();

        try {
            await client.query('BEGIN');

            await bookingModel.createBooking(bookingId, userId, showId, 'PENDING');

            const seats = await seatService.lockSeats(showId, seatNumbers);

            if (seats.length !== seatNumbers.length) {
                await bookingModel.updateStatus(bookingId, 'FAILED');
                await client.query('COMMIT');
                return { error: true, status: 'FAILED', message: 'Some seats are no longer available' };
            }

            const seatIds = seats.map(s => s.id);
            await seatService.markSeatsBooked(seatIds);

            for (const seatId of seatIds) {
                await bookingItemModel.addBookingItem(uuid(), bookingId, seatId);
            }

            await bookingModel.updateStatus(bookingId, 'CONFIRMED');

            await client.query('COMMIT');
            return { id: bookingId, status: 'CONFIRMED' };

        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
};
