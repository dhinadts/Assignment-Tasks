const seatModel = require('../models/seatModel');
const { v4: uuid } = require('uuid');
const pool = require('../config/db');

module.exports = {
    // Get all seats for a show
    getSeatsByShow: async (showId) => {
        const result = await seatModel.getSeatsByShow(showId);
        return result.rows;
    },

    // Lock seats for booking (used in booking service)
    lockSeats: async (showId, seatNumbers) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const seats = await seatModel.lockAvailableSeats(showId, seatNumbers);

            await client.query('COMMIT');
            return seats.rows;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    // Mark seats as booked
    markSeatsBooked: async (seatIds) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            for (const seatId of seatIds) {
                await seatModel.markBooked(seatId);
            }
            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
};
