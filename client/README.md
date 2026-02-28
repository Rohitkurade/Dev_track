# DevTrack Frontend

React frontend for DevTrack - Developer Career Progress & Job Tracking Platform

## Features

- React 18 with Vite
- React Router v6
- Tailwind CSS
- Dark/Light Mode
- Responsive Design
- Recharts Visualization
- Context API
- Axios with Interceptors

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the App

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
client/
├── src/
│   ├── components/    # Reusable components
│   ├── context/      # Context providers
│   ├── pages/        # Page components
│   ├── services/     # API services
│   ├── App.jsx       # Main app
│   ├── main.jsx      # Entry point
│   └── index.css     # Global styles
├── index.html
├── vite.config.js
└── tailwind.config.js
```

## Pages

- Login
- Register
- Dashboard (Analytics)
- Problems (DSA Tracker)
- Jobs (Job Application Tracker)
- Projects (Project Manager)
- Admin Panel
- 404 Not Found

## Components

- Layout (Navigation & Header)
- Card
- Table
- Modal
- Pagination
- LoadingSpinner

## Context Providers

- AuthContext (Authentication state)
- ThemeContext (Dark/Light mode)

## Author

Rohit Kurade
