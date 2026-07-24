# Advanced Nagar Rakshak

## Overview

Advanced Nagar Rakshak is a full-stack web application designed to streamline the reporting and management of civic issues. The platform enables citizens to report problems such as potholes, garbage accumulation, damaged streetlights, waterlogging, and other public infrastructure concerns. Municipal administrators can monitor, manage, and update the status of reported issues through a centralized dashboard.

The project focuses on improving communication between citizens and local authorities while providing a secure, responsive, and user-friendly interface.

---

## Live Application

**Frontend (Vercel)**
https://advancednagarrakshakbyraj.vercel.app

The backend is deployed separately on Render and connected securely to the frontend.

---

## Key Features

### Citizen Portal

* User registration and authentication
* Secure login using JWT authentication
* Report civic issues
* View submitted complaints
* Track complaint status
* Responsive user dashboard
* Profile management

### Administrator Portal

* Secure administrator authentication
* Dashboard with issue statistics
* Monitor all reported issues
* Update complaint status
* Category-wise issue analysis
* Issue management interface

### Security

* JWT-based authentication
* Password hashing using bcrypt
* HTTP-only cookies
* Request validation using Zod
* Helmet for HTTP security headers
* CORS protection

---

## Technology Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* Axios
* React Hook Form
* Zod
* React Hot Toast
* Lucide React
* React Leaflet
* Recharts

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs
* Cookie Parser
* Helmet
* Morgan

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## Project Structure

```text
advanced-nagar-rakshak
│
├── backend/          # Express.js REST API
├── frontend/         # Next.js Application
├── docs/             # Project documentation
└── shared/           # Shared resources
```

---

## Local Setup

### Clone the Repository

```bash
git clone https://github.com/Raaajitis/advanced-nagar-rakshak.git

cd advanced-nagar-rakshak
```

---

### Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
```

Run the backend server.

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend

npm install
```

Create a `.env.local` file.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run the frontend.

```bash
npm run dev
```

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| POST   | `/api/auth/register` | Register a new user      |
| POST   | `/api/auth/login`    | User login               |
| POST   | `/api/auth/logout`   | User logout              |
| GET    | `/api/auth/profile`  | Fetch authenticated user |

### Issues

| Method | Endpoint          | Description               |
| ------ | ----------------- | ------------------------- |
| POST   | `/api/issues`     | Create a new issue        |
| GET    | `/api/issues`     | Retrieve all issues       |
| GET    | `/api/issues/:id` | Retrieve a specific issue |
| PATCH  | `/api/issues/:id` | Update issue status       |

### Administration

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| GET    | `/api/admin/stats` | Dashboard statistics |

---


## Future Enhancements

* AI-assisted issue prioritization
* Email notifications
* Push notifications
* Real-time issue tracking
* GIS and Google Maps integration
* Image-based issue classification
* Multilingual support
* Data analytics dashboard
* Complaint voting and feedback system

---

## Developer

**Rajvardhan Singh Yadav**

Bachelor of Computer Applications (Computer Science)
UPES, Dehradun

GitHub Repository:
https://github.com/Raaajitis/advanced-nagar-rakshak

---

## License

This project has been developed for educational, academic, and internship demonstration purposes.
