const pool = require('../config/db');

module.exports = {
    createShow: async (id, name, startTime, totalSeats) => {
        const query = `
            INSERT INTO shows (id, name, start_time, total_seats)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [id, name, startTime, totalSeats];

        return pool.query(query, values);
    },

    getAllShows: () =>
        pool.query(`
        SELECT 
            s.id,
            s.name,
            s.start_time,
            s.total_seats,
            COUNT(CASE WHEN seats.is_booked = true THEN 1 END) AS booked_seats,
            ARRAY(
                SELECT seat_number 
                FROM seats 
                WHERE seats.show_id = s.id AND is_booked = true
                ORDER BY seat_number::int
            ) AS booked_numbers
        FROM shows s
        LEFT JOIN seats ON seats.show_id = s.id
        GROUP BY s.id
        ORDER BY s.start_time ASC;
    `),

    /*     getAllShows: async () => {
            const query = `
                SELECT id, name, start_time, total_seats
                FROM shows
                ORDER BY start_time ASC;
            `;
            return pool.query(query);
        } */
};
