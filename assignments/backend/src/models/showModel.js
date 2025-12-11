const pool = require('../config/db');

module.exports = {
    // CREATE SHOW
    createShow: async (id, name, startTime, totalSeats) => {
        const query = `
            INSERT INTO shows (id, name, start_time, total_seats)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [id, name, startTime, totalSeats];

        return pool.query(query, values);
    },

    // GET ALL SHOWS
    getAllShows: async () => {
        const query = `
            SELECT id, name, start_time, total_seats
            FROM shows
            ORDER BY start_time ASC;
        `;
        return pool.query(query);
    }
};
