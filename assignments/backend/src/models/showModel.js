const pool = require('../config/db');

module.exports = {
    createShow: (id, name, startTime, totalSeats) =>
        pool.query(
            `INSERT INTO shows (id, name, start_time, total_seats) VALUES ($1,$2,$3,$4)`,
            [id, name, startTime, totalSeats]
        ),

    getAllShows: () =>
        pool.query(
            `SELECT id, name, start_time, total_seats FROM shows ORDER BY start_time ASC`
        ),
};
