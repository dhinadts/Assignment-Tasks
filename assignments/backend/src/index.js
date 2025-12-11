require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Initialize tables if not exists (simple)
async function initDb() {
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
  await pool.query(`
    CREATE TYPE booking_status AS ENUM ('PENDING','CONFIRMED','FAILED');
    `).catch(()=>{});
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
}

initDb().catch(err=>{ console.error('DB init error', err); process.exit(1); });

// Admin: create show with seats
app.post('/admin/shows', async (req, res) => {
  const { name, start_time, total_seats } = req.body;
  if (!name || !start_time || !total_seats) return res.status(400).json({ error: 'missing fields' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const showId = uuidv4();
    await client.query(
      'INSERT INTO shows (id, name, start_time, total_seats) VALUES ($1,$2,$3,$4)',
      [showId, name, start_time, total_seats]
    );
    // create seats numbered 1..total_seats
    const seatInserts = [];
    for (let i=1;i<=total_seats;i++){
      const seatId = uuidv4();
      const seatNumber = String(i);
      seatInserts.push(client.query(
        'INSERT INTO seats (id, show_id, seat_number) VALUES ($1,$2,$3)',
        [seatId, showId, seatNumber]
      ));
    }
    await Promise.all(seatInserts);
    await client.query('COMMIT');
    res.json({ id: showId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'internal' });
  } finally {
    client.release();
  }
});

// List shows
app.get('/shows', async (req, res) => {
  const result = await pool.query('SELECT id, name, start_time, total_seats FROM shows ORDER BY start_time ASC');
  res.json(result.rows);
});

// Get seats for show
app.get('/shows/:id/seats', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT id, seat_number, is_booked FROM seats WHERE show_id=$1 ORDER BY seat_number::int', [id]);
  res.json(result.rows);
});

// Create booking (concurrency-safe)
app.post('/bookings', async (req, res) => {
  const { userId, showId, seatNumbers } = req.body;
  if (!showId || !seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length===0) {
    return res.status(400).json({ error: 'invalid payload' });
  }
  const client = await pool.connect();
  const bookingId = uuidv4();
  try {
    await client.query('BEGIN');
    // insert booking as PENDING
    await client.query(
      'INSERT INTO bookings (id, user_id, show_id, status) VALUES ($1,$2,$3,$4)',
      [bookingId, userId || null, showId, 'PENDING']
    );
    // Select requested seats that are not booked with FOR UPDATE SKIP LOCKED
    const seatsRes = await client.query(
      `SELECT id, seat_number FROM seats WHERE show_id=$1 AND seat_number = ANY($2) AND is_booked = false FOR UPDATE SKIP LOCKED`,
      [showId, seatNumbers]
    );
    if (seatsRes.rows.length !== seatNumbers.length) {
      // failed - some seats unavailable
      await client.query('UPDATE bookings SET status=$1 WHERE id=$2', ['FAILED', bookingId]);
      await client.query('COMMIT');
      return res.status(409).json({ status: 'FAILED', message: 'Some seats are no longer available' });
    }
    // mark seats as booked
    const seatIds = seatsRes.rows.map(r=>r.id);
    for (const seatId of seatIds) {
      await client.query('UPDATE seats SET is_booked=true WHERE id=$1', [seatId]);
      await client.query('INSERT INTO booking_items (id, booking_id, seat_id) VALUES ($1,$2,$3)', [uuidv4(), bookingId, seatId]);
    }
    await client.query('UPDATE bookings SET status=$1 WHERE id=$2', ['CONFIRMED', bookingId]);
    await client.query('COMMIT');
    res.json({ id: bookingId, status: 'CONFIRMED' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'internal' });
  } finally {
    client.release();
  }
});

// get booking status
app.get('/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const b = await pool.query('SELECT id, status, created_at FROM bookings WHERE id=$1', [id]);
  if (b.rows.length===0) return res.status(404).json({ error: 'not found' });
  res.json(b.rows[0]);
});

// background job to expire pending bookings older than 2 minutes
setInterval(async () => {
  try {
    await pool.query(
      `UPDATE bookings SET status='FAILED' WHERE status='PENDING' AND created_at < NOW() - INTERVAL '2 minutes'`
    );
  } catch (err) {
    console.error('expiry job error', err);
  }
}, 30 * 1000); // every 30s

app.listen(PORT, ()=> console.log('Server running on', PORT));
