import React, { useEffect, useState } from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';

export default function Booking() {
  const { id } = useParams();

  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) return;

    api
      .get(`/shows/${id}/seats`)
      .then((res) => setSeats(res.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [id]);

  function toggleSeat(num) {
    if (selected.includes(num)) {
      setSelected(selected.filter((s) => s !== num));
    } else {
      setSelected([...selected, num]);
    }
  }

  async function book() {
    setMessage('Booking...');

    try {
      const res = await api.post('/bookings', {
        showId: id,
        seatNumbers: selected,
      });

      setMessage('Booking ' + res.data.status + ' — id: ' + res.data.id);

      // refresh seats after booking
      const r = await api.get(`/shows/${id}/seats`);
      setSeats(r.data);
      setSelected([]);
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(
          'Error: ' +
          (err.response.data.message || err.response.data.error)
        );
      } else {
        setMessage('Unknown error');
      }
    }
  }

  if (loading)
    return <div style={{ padding: 20 }}>Loading seats...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Booking</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 40px)',
          gap: 8,
          maxWidth: 8 * 40,
        }}
      >
        {seats.map((s) => {
          const isSelected = selected.includes(s.seat_number);

          return (
            <div
              key={s.id}
              onClick={() =>
                !s.is_booked && toggleSeat(s.seat_number)
              }
              style={{
                width: 40,
                height: 40,
                lineHeight: '40px',
                textAlign: 'center',
                border: '1px solid #333',
                background: s.is_booked
                  ? '#ccc'
                  : isSelected
                    ? '#8f8'
                    : '#fff',
                cursor: s.is_booked ? 'not-allowed' : 'pointer',
              }}
            >
              {s.seat_number}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={book} disabled={selected.length === 0}>
          Book {selected.length} seat(s)
        </button>

        <div style={{ marginTop: 10 }}>{message}</div>
      </div>
    </div>
  );
}
