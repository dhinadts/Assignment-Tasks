import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function Home() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/shows')
      .then((res) => setShows(res.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (shows.length === 0) {
    return <div style={{ padding: 20 }}>No shows available</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Available Shows</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}
      >
        {shows.map((show) => (
          <div
            key={show.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 10,
              padding: 20,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ marginBottom: 10 }}>{show.name}</h3>

            <p style={{ margin: '6px 0' }}>
              <strong>Start Time:</strong> {new Date(show.start_time).toLocaleString()}
            </p>

            <p><b>Total Seats:</b> {show.total_seats}</p>

            <p><b>Booked:</b> {show.booked_seats}</p>

            <p><b>Available:</b> {show.total_seats - show.booked_seats}</p>

            {/* <p style={{ margin: '6px 0' }}>
              <strong>Available Seats:</strong> {show.available_seats}
            </p> */}

            <Link
              to={`/booking/${show.id}`}
              style={{
                marginTop: 10,
                display: 'inline-block',
                padding: '8px 14px',
                background: '#007bff',
                borderRadius: 6,
                color: '#fff',
                textDecoration: 'none',
                fontSize: 14,
              }}
            >
              Book Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
