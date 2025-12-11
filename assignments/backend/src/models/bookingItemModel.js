const pool = require('../config/db');

module.exports = {
    addBookingItem: (id, bookingId, seatId) =>
        pool.query(
            `INSERT INTO booking_items (id, booking_id, seat_id) VALUES ($1,$2,$3)`,
            [id, bookingId, seatId]
        ),
};
