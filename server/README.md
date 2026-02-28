# DevTrack Backend

RESTful API for DevTrack - Developer Career Progress & Job Tracking Platform

## Features

- JWT Authentication (Access + Refresh Token)
- Role-based Authorization
- RESTful API Architecture
- MongoDB with Mongoose
- Input Validation
- Error Handling
- CORS Support

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/devtrack
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLIENT_URL=http://localhost:5173
```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login
- POST `/api/auth/refresh` - Refresh Token
- POST `/api/auth/logout` - Logout
- GET `/api/auth/me` - Get Current User

### Problems
- GET `/api/problems` - Get all problems
- POST `/api/problems` - Add problem
- GET `/api/problems/:id` - Get problem
- PUT `/api/problems/:id` - Update problem
- DELETE `/api/problems/:id` - Delete problem

### Jobs
- GET `/api/jobs` - Get all jobs
- POST `/api/jobs` - Add job
- GET `/api/jobs/:id` - Get job
- PUT `/api/jobs/:id` - Update job
- DELETE `/api/jobs/:id` - Delete job

### Projects
- GET `/api/projects` - Get all projects
- POST `/api/projects` - Add project
- GET `/api/projects/:id` - Get project
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project

### Analytics
- GET `/api/analytics/dsa` - Get DSA analytics
- GET `/api/analytics/jobs` - Get job analytics

### Admin
- GET `/api/admin/users` - Get all users
- GET `/api/admin/stats` - Get platform stats
- DELETE `/api/admin/users/:id` - Delete user
- PUT `/api/admin/users/:id/role` - Update user role

## Project Structure

```
server/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middlewares/      # Custom middlewares
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── app.js           # Express app
└── server.js        # Entry point
```

## Author

Rohit Kurade
