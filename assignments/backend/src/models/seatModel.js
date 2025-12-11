const pool = require('../config/db');

module.exports = {
    createSeat: (id, showId, seatNumber) =>
        pool.query(
            `INSERT INTO seats (id, show_id, seat_number) VALUES ($1,$2,$3)`,
            [id, showId, seatNumber]
        ),

    getSeatsByShow: (showId) =>
        pool.query(
            `SELECT id, seat_number, is_booked FROM seats WHERE show_id=$1 ORDER BY seat_number::int`,
            [showId]
        ),

    lockAvailableSeats: (showId, numbers) =>
        pool.query(
            `SELECT id, seat_number 
       FROM seats 
       WHERE show_id=$1 AND seat_number = ANY($2) AND is_booked = false 
       FOR UPDATE SKIP LOCKED`,
            [showId, numbers]
        ),

    markBooked: (seatId) =>
        pool.query(`UPDATE seats SET is_booked=true WHERE id=$1`, [seatId]),
};
