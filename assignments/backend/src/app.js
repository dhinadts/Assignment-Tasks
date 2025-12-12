const express = require('express');
const cors = require('cors');
require('dotenv').config();

const initDb = require('./utils/initDb');

const adminRoutes = require('./routes/adminRoutes');
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(cors());
app.use(express.json());

initDb();

app.use('/admin', adminRoutes);
app.use('/shows', showRoutes);
app.use('/bookings', bookingRoutes);

module.exports = app;
