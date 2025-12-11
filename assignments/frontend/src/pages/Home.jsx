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
      <h2>Available Shows</h2>
      <ul>
        {shows.map((show) => (
          <li key={show.id} style={{ marginBottom: 10 }}>
            <strong>{show.name}</strong> — {new Date(show.start_time).toLocaleString()}
            {' '}
            <Link to={`/booking/${show.id}`}>Book</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
