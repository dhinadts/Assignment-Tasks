/* const pool = require('../config/db');

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
 */
const pool = require('../config/db');

module.exports = {
    // CREATE SEAT
    createSeat: (id, showId, seatNumber) =>
        pool.query(
            `INSERT INTO seats (id, show_id, seat_number)
             VALUES ($1,$2,$3)`,
            [id, showId, seatNumber]
        ),

    // GET ALL SEATS FOR A SHOW
    getSeatsByShow: (showId) =>
        pool.query(
            `SELECT id, seat_number, is_booked 
             FROM seats 
             WHERE show_id = $1 
             ORDER BY seat_number::int`,
            [showId]
        ),

    // NEW → GET ALL SEATS (all shows)
    getAllSeats: () =>
        pool.query(
            `SELECT 
                s.id,
                s.seat_number,
                s.is_booked,
                s.show_id,
                sh.name AS show_name,
                sh.start_time
            FROM seats s
            JOIN shows sh ON sh.id = s.show_id
            ORDER BY sh.start_time ASC, s.seat_number::int`
        ),

    // LOCK available seats for booking
    lockAvailableSeats: (showId, numbers) =>
        pool.query(
            `SELECT id, seat_number 
             FROM seats 
             WHERE show_id=$1 
               AND seat_number = ANY($2) 
               AND is_booked = false 
             FOR UPDATE SKIP LOCKED`,
            [showId, numbers]
        ),

    // MARK SEAT BOOKED
    markBooked: (seatId) =>
        pool.query(
            `UPDATE seats 
             SET is_booked = true 
             WHERE id = $1`,
            [seatId]
        ),
};
