# 🚀 User Management REST API

A production-ready Node.js + Express REST API covering all Phase 1 + 2 concepts.

---

## 📁 Project Structure

```
user-management-api/
├── src/
│   ├── config/
│   │   └── db.js                    ← MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js       ← handles auth req/res
│   │   └── user.controller.js       ← handles user req/res
│   ├── middlewares/
│   │   ├── auth.middleware.js       ← JWT protect + role restrict
│   │   ├── error.middleware.js      ← global error handler
│   │   ├── logger.middleware.js     ← custom request logger
│   │   └── validate.middleware.js   ← input validation
│   ├── models/
│   │   └── user.model.js            ← Mongoose schema
│   ├── routes/
│   │   ├── auth.routes.js           ← /api/auth endpoints
│   │   └── user.routes.js           ← /api/users endpoints
│   ├── services/
│   │   ├── auth.service.js          ← register/login logic
│   │   └── user.service.js          ← CRUD business logic
│   └── utils/
│       ├── AppError.js              ← custom error class
│       └── catchAsync.js            ← async error wrapper
├── .env
├── .gitignore
├── package.json
└── server.js                        ← entry point
```

---

## ⚙️ Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Setup .env file (already created, update values)
# Make sure MongoDB is running

# 3. Run in development
npm run dev

# 4. Run in production
npm start
```

---

## 🛣️ API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Create new account |
| POST | `/api/auth/login` | Public | Login & get token |
| GET | `/api/auth/me` | Protected | Get my profile |

### User Routes (`/api/users`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | Get all users (with pagination) |
| GET | `/api/users/:id` | Admin | Get user by ID |
| PUT | `/api/users/:id` | Protected | Update user |
| DELETE | `/api/users/:id` | Admin | Delete user |
| PATCH | `/api/users/:id/toggle-status` | Admin | Activate/deactivate user |

---

## 🧪 Test with curl

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'

# Get my profile (replace TOKEN with actual token from login)
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# Get all users with pagination (admin token required)
curl "http://localhost:3000/api/users?page=1&limit=5" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 🧠 Concepts Used

| Concept | Where |
|---------|-------|
| MVC Pattern | controllers/, services/, models/ |
| Custom Middleware | logger, validate, auth |
| Error Handling | AppError + catchAsync + errorHandler |
| JWT Auth | auth.middleware.js + auth.service.js |
| Role-Based Access | restrictTo() middleware |
| Rate Limiting | server.js (express-rate-limit) |
| Security Headers | server.js (helmet) |
| CORS | server.js (cors) |
| Password Hashing | user.model.js (bcryptjs) |
| Pagination | user.service.js |
