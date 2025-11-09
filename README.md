# Online Salon Booking System

A full-stack web application for managing salon appointments and services, built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🌟 Features

- **User Authentication & Authorization**
  - Secure login and registration system
  - Role-based access control (Admin, Stylist, Customer)
  - JWT-based authentication

- **Customer Features**
  - Browse available stylists
  - Book appointments
  - View and manage appointments
  - Update profile information
  - Upload profile pictures

- **Stylist Features**
  - Apply to become a stylist
  - Manage appointments
  - Update availability
  - Professional profile management

- **Admin Features**
  - Dashboard with overview statistics
  - Manage stylist applications
  - View all appointments
  - User management
  - System monitoring

## 🛠️ Tech Stack

### Frontend
- React.js 18.2.0
- Redux Toolkit for state management
- React Router v6 for navigation
- Axios for API requests
- React Hot Toast for notifications
- JWT decode for authentication
- CSS for styling
- React Icons
- React Spinners for loading states

### Backend
- Node.js
- Express.js 4.18.2
- MongoDB with Mongoose 6.9.0
- JWT for authentication
- Bcrypt for password hashing
- CORS middleware

### DevOps
- Docker & Docker Compose
- Environment configuration
- Proxy setup for development

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- MongoDB
- Docker and Docker Compose (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/shimrin23/Online-Salon-Booking.git]
   cd OnlineSalonBooking
   ```

   

2. **Using Docker (Recommended)**
   ```bash
   docker-compose up
   ```
   This will start both frontend and backend services.

3. **Manual Setup**

   Backend Setup:
   ```bash
   cd backend
   npm install
   npm start
   ```

   Frontend Setup:
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Environment Variables

Create `.env` files in both frontend and backend directories:

Backend `.env`:
```
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Frontend `.env`:
```
REACT_APP_API_URL=http://localhost:5001
```

## 📝 API Documentation

### User Routes
- POST `/api/users/register` - Register new user
- POST `/api/users/login` - User login
- GET `/api/users/getuser/:id` - Get user profile

### Stylist Routes
- GET `/api/stylist/getall` - Get all stylists
- POST `/api/stylist/apply` - Apply as stylist

### Appointment Routes
- POST `/api/appointment/book` - Book appointment
- GET `/api/appointment/getall` - Get all appointments
- PUT `/api/appointment/update` - Update appointment status

## 🔒 Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- CORS protection
- Input validation and sanitization

## 🎨 Frontend Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Main application pages
│   ├── redux/         # State management
│   ├── styles/        # CSS stylesheets
│   ├── helper/        # Utility functions
│   └── middleware/    # Route protection
```

## 📁 Backend Structure

```
backend/
├── controllers/    # Request handlers
├── models/        # Database models
├── routes/        # API routes
├── middleware/    # Custom middleware
└── db/           # Database configuration
```

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

- **Shimrin** - *Initial work*

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by modern salon management systems
- Built with love for the salon industry
