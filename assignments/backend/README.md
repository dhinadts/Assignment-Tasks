
# Ticket Booking System – Backend (Node.js + Express + PostgreSQL)

This backend provides REST APIs for managing shows, seats, and bookings.
It supports concurrency-safe seat locking using PostgreSQL row-level locking.

## Tech Stack

Node.js
Express
PostgreSQL
UUID

## Project Structure: 
```
backend/
│── config/
│   └── db.js
│── controllers/
│   ├── bookingController.js
│   └── showController.js
│── models/
│   ├── seatModel.js
│   ├── bookingModel.js
│   └── showModel.js
│── routes/
│   ├── showRoutes.js
│   └── bookingRoutes.js
│── services/
│   └── bookingService.js
│── index.js
│── package.json
```
clone the repo using git and go to this backend directory and directory 
```
npm install
```

Do Configure your PostgreSQL
and then, 

```
npm run dev
```
