# DevTrack - Developer Career Progress & Job Tracking Platform

A full-stack MERN application to help developers track their DSA problem-solving progress, job applications, and projects all in one place.

## 🚀 Features

- **JWT Authentication** - Secure authentication with access & refresh tokens
- **Role-Based Authorization** - User and Admin roles
- **DSA Problem Tracker** - Track coding problems by difficulty, topic, and status
- **Job Application Tracker** - Manage job applications with status tracking
- **Project Manager** - Keep track of all your development projects
- **Analytics Dashboard** - Visualize your progress with charts and statistics
- **Admin Dashboard** - Platform management and user oversight
- **Dark/Light Mode** - Toggle between themes
- **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite
- React Router v6
- Axios (with interceptors)
- Tailwind CSS
- Recharts (for analytics visualization)
- Context API (state management)

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT (Access + Refresh tokens)
- bcrypt (password hashing)
- express-validator (validation)
- cookie-parser
- CORS enabled

## 📁 Project Structure

```
Dev_Track/
├── server/                 # Backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Custom middlewares
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── app.js             # Express app setup
│   ├── server.js          # Server entry point
│   └── package.json
│
├── client/                # Frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Context providers
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (use `.env.example` as reference):
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/devtrack
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLIENT_URL=http://localhost:5173
```

4. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Client will run on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Problems Endpoints
- `GET /api/problems` - Get all problems (with filters & pagination)
- `POST /api/problems` - Add new problem
- `GET /api/problems/:id` - Get single problem
- `PUT /api/problems/:id` - Update problem
- `DELETE /api/problems/:id` - Delete problem

### Jobs Endpoints
- `GET /api/jobs` - Get all job applications
- `POST /api/jobs` - Add new job application
- `GET /api/jobs/:id` - Get single job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Projects Endpoints
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Add new project
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Analytics Endpoints
- `GET /api/analytics/dsa` - Get DSA analytics
- `GET /api/analytics/jobs` - Get job funnel analytics

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get platform statistics
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/role` - Update user role

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies for refresh tokens
- Protected routes middleware
- Role-based authorization
- Input validation with express-validator
- CORS configuration

## 🎨 UI Features

- Modern, clean interface
- Dark/Light mode toggle
- Fully responsive design
- Interactive charts and analytics
- Smooth animations
- Toast notifications

## 📊 Analytics

- Total problems solved
- Difficulty distribution (Easy/Medium/Hard)
- Topic-wise distribution
- Weekly solving trend
- Job application funnel
- Platform statistics (Admin)

## 👥 User Roles

### User
- Track DSA problems
- Manage job applications
- Manage projects
- View personal analytics

### Admin
- All user features
- View all users
- Platform statistics
- Delete users
- Manage user roles

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Rohit Kurade**

## 🙏 Acknowledgments

- React community
- Express.js team
- MongoDB team
- Tailwind CSS team
- Recharts library

---

**Happy Coding! 🚀**
