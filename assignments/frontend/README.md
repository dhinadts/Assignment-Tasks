# Seat/Slot Booking System – Frontend

A React-based frontend for the Seat/Slot Booking System, allowing users to view shows, check seat availability, and book tickets.

## Tech Stack

React,
React Router,
Axios,
CSS / Inline Styling,
Vite 

##Project Structure
```
frontend/
│── src/
│   ├── pages/
│   │   ├── Home.jsx       # List all shows
│   │   ├── Booking.jsx    # Seat selection and booking
│   │   └── Admin.jsx      # Admin panel
│   ├── api.js             # Axios instance for API calls
│   ├── App.jsx            # Main app with routing
│   └── main.jsx           # Entry point
│── public/
│── package.json
│── README.md

```

## Installation

Navigate to the frontend folder:

``` 
cd frontend
```


Install dependencies:

```npm install```


Ensure src/api.js points to your backend URL:

import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000", // Backend URL
});

## Run Frontend
```npm run dev```


Frontend will run at:

http://localhost:5173

