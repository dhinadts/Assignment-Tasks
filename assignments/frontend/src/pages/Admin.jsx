import React, { useState } from 'react';
import api from '../api';

export default function Admin() {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [totalSeats, setTotalSeats] = useState(20);
  const [msg, setMsg] = useState('');

  async function createShow(e) {
    e.preventDefault();
    try {
      const res = await api.post('/admin/shows', {
        name,
        start_time: startTime,
        total_seats: totalSeats,
      });

      setMsg('Created show id: ' + res.data.id);
    } catch (err) {
      setMsg('Error creating show');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin - Create Show</h2>

      <form onSubmit={createShow}>
        <div>
          <label>
            Name:{' '}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Start Time:{' '}
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Total Seats:{' '}
            <input
              type="number"
              value={totalSeats}
              onChange={(e) => setTotalSeats(Number(e.target.value))}
              required
            />
          </label>
        </div>

        <button type="submit">Create</button>
      </form>

      {msg && <p>{msg}</p>}
    </div>
  );
}
