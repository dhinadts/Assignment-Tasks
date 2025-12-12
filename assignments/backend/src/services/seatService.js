const seatModel = require('../models/seatModel');
const { v4: uuid } = require('uuid');
const pool = require('../config/db');

module.exports = {
    getSeatsByShow: async (showId) => {
        const result = await seatModel.getSeatsByShow(showId);
        return result.rows;
    },

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
