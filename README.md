# Airbnb Capstone

Airbnb is a full-stack accommodation booking platform. The project contains a React customer experience, a role-protected admin workspace, and a Node.js/Express/MongoDB API.

## Features

### Customer Experience

The customer experience supports:

- Accommodation discovery
- Accommodation search
- Property details
- Image galleries
- Amenities
- Date selection
- Guest selection
- Dynamic booking totals
- User authentication
- Reservation creation
- Responsive design

### Admin Workspace

The admin workspace supports:

- Dashboard analytics
- Accommodation CRUD operations
- Listing search and filters
- Image previews
- Reservation management
- Reservation status updates
- User search
- User role management
- Protected admin routes
- Responsive sidebar navigation

## Technology Stack

| Layer | Technology |
|---|---|
| Customer and admin frontend | React, React Router, Vite, CSS |
| API | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Styling | Responsive CSS |
| Property Images | Remote property photography |

## Project Structure


AirBnB-Capstone/
├── client/                     React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/                     Express API
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── API documentation.md
├── README.md
└── SUBMISSION-CHECKLIST.md