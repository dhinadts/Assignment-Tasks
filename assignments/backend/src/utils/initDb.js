const pool = require('../config/db');

module.exports = async () => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS shows (
      id uuid PRIMARY KEY,
      name text NOT NULL,
      start_time timestamp NOT NULL,
      total_seats int NOT NULL,
      created_at timestamp DEFAULT now()
    );
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS seats (
      id uuid PRIMARY KEY,
      show_id uuid REFERENCES shows(id) ON DELETE CASCADE,
      seat_number text,
      is_booked boolean DEFAULT false
    );
  `);

    await pool.query(`CREATE TYPE booking_status AS ENUM ('PENDING','CONFIRMED','FAILED');`)
        .catch(() => { });

    await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id uuid PRIMARY KEY,
      user_id uuid,
      show_id uuid REFERENCES shows(id) ON DELETE CASCADE,
      status booking_status DEFAULT 'PENDING',
      created_at timestamp DEFAULT now()
    );
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS booking_items (
      id uuid PRIMARY KEY,
      booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
      seat_id uuid REFERENCES seats(id)
    );
  `);
};
