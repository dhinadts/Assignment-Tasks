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

            // 1. Create booking as PENDING
            await bookingModel.createBooking(bookingId, userId, showId, 'PENDING');

            // 2. Lock seats (concurrency-safe)
            const seats = await seatService.lockSeats(showId, seatNumbers);

            // 3. Check if all requested seats are available
            if (seats.length !== seatNumbers.length) {
                await bookingModel.updateStatus(bookingId, 'FAILED');
                await client.query('COMMIT');
                return { error: true, status: 'FAILED', message: 'Some seats are no longer available' };
            }

            // 4. Mark seats booked & add booking items
            const seatIds = seats.map(s => s.id);
            await seatService.markSeatsBooked(seatIds);

            for (const seatId of seatIds) {
                await bookingItemModel.addBookingItem(uuid(), bookingId, seatId);
            }

            // 5. Update booking status to CONFIRMED
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
