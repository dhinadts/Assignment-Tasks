const pool = require('../config/db');

module.exports = {
    createBooking: (id, userId, showId, status) =>
        pool.query(
            `INSERT INTO bookings (id, user_id, show_id, status) VALUES ($1,$2,$3,$4)`,
            [id, userId, showId, status]
        ),

    updateStatus: (id, status) =>
        pool.query(`UPDATE bookings SET status=$1 WHERE id=$2`, [status, id]),

    getBooking: (id) =>
        pool.query(
            `SELECT id, status, created_at FROM bookings WHERE id=$1`,
            [id]
        ),
};
