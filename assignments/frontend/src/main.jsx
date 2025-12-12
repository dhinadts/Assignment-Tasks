import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Booking from './pages/Booking';
import logo from './assets/react_logo.svg';

function App() {
  return (
    <BrowserRouter>
      <nav style={{
        padding: 10,
        borderBottom: "1px solid #ddd",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>

          <div>
            <img src={logo} alt="React Logo" style={{ height: 30 }} />
          </div>

          <div style={{
            display: "flex",
            gap: 20
          }}>
            <Link to="/">Home</Link>
            <Link to="/admin">Admin</Link>
            <Link to="/booking/1">Booking</Link>
          </div>

        </div>
      </nav>


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/booking/:id" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  );
}


createRoot(document.getElementById('root')).render(<App />);

