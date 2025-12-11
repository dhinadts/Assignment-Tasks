const { v4: uuid } = require('uuid');
const showModel = require('../models/showModel');
const seatModel = require('../models/seatModel');
const pool = require('../config/db');

module.exports = {
    createShow: async (name, start_time, totalSeats) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const showId = uuid();

            await showModel.createShow(showId, name, start_time, totalSeats);

            let seatPromises = [];
            for (let i = 1; i <= totalSeats; i++) {
                seatPromises.push(
                    seatModel.createSeat(uuid(), showId, String(i))
                );
            }
            await Promise.all(seatPromises);

            await client.query('COMMIT');
            return showId;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    listShows: () => showModel.getAllShows()
};
