# 🚀 TaskFlow API

> A scalable REST API with React frontend, JWT authentication, role-based access control, and Swagger documentation.

## Live Demo

Frontend:
https://your-vercel-domain.vercel.app

Backend:
https://taskflow-api-backend-u17h.onrender.com

API Documentation:
https://taskflow-api-backend-u17h.onrender.com/api-docs


## Tech Stack

| Layer      | Technology                                   |
|------------|----------------------------------------------|
| **Frontend** | React 19 + Vite + React Router              |
| **Backend**  | Node.js + Express                           |
| **Database** | MongoDB + Mongoose ODM                      |
| **Auth**     | JWT (JSON Web Tokens) + bcrypt              |
| **Docs**     | Swagger UI (swagger-jsdoc + swagger-ui-express) |

## 📁 Project Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── config/db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Register, Login, GetMe
│   │   │   └── task.controller.js    # CRUD with ownership checks
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT protect + adminOnly
│   │   │   └── error.middleware.js   # Global error handler
│   │   ├── models/
│   │   │   ├── User.model.js         # User schema (bcrypt hashing)
│   │   │   └── Task.model.js         # Task schema (status enum)
│   │   ├── routes/v1/
│   │   │   ├── auth.routes.js
│   │   │   └── task.routes.js
│   │   ├── swagger.js                # OpenAPI 3.0 config
│   │   └── app.js                    # Express entry point
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js              # Axios instance + JWT interceptor
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── components/TaskCard.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)


### Screenshots

![alt text](<Screenshot 2026-06-08 182413-1.png>)

![alt text](<Screenshot 2026-06-08 182450.png>)



### 1. Backend Setup

```bash
cd backend
npm install
```

Configure your `.env` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/interndb
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```

Start the backend:
```bash
npm run dev
```

The API will be running at `http://localhost:5000`
Swagger docs available at `http://localhost:5000/api-docs`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The React app will be running at `http://localhost:5173`

## 🔐 API Endpoints

### Auth
| Method | Endpoint             | Description              | Auth |
|--------|----------------------|--------------------------|------|
| POST   | `/api/v1/auth/register` | Register a new user     | ❌   |
| POST   | `/api/v1/auth/login`    | Login and get JWT       | ❌   |
| GET    | `/api/v1/auth/me`       | Get current user profile| ✅   |

### Tasks
| Method | Endpoint              | Description                        | Auth |
|--------|-----------------------|------------------------------------|------|
| GET    | `/api/v1/tasks`       | Get tasks (own for user, all for admin) | ✅   |
| POST   | `/api/v1/tasks`       | Create a new task                  | ✅   |
| PUT    | `/api/v1/tasks/:id`   | Update a task                      | ✅   |
| DELETE | `/api/v1/tasks/:id`   | Delete a task                      | ✅   |

## 🏆 Features

- ✅ **JWT Authentication** with auto-attach interceptor
- ✅ **Role-Based Access Control** (user/admin)
- ✅ **Task Ownership** — Users can only modify their own tasks
- ✅ **Admin Override** — Admins can manage all tasks
- ✅ **Swagger UI** with Authorize button for testing
- ✅ **Premium Dark UI** with glassmorphism and micro-animations
- ✅ **Responsive Design** for mobile and desktop
- ✅ **Toast Notifications** for user feedback

## 📈 Scalability Notes

- **Stateless JWT auth** → No server-side sessions; horizontally scalable behind a load balancer
- **Mongoose ODM** → Schema validation at app level; easy to swap to Atlas for cloud scaling
- **Modular structure** → Each feature (auth, tasks) is isolated; ready to split into microservices
- **API versioning** (`/api/v1/`) → Add v2 routes without breaking existing clients
- **Future additions**: Redis for token blacklisting/caching, Docker + docker-compose for containerization, Nginx as reverse proxy

## 📝 License

MIT
