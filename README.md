# 💰 Finance Data Processing & Access Control Backend

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.x-orange)
![Sequelize](https://img.shields.io/badge/ORM-Sequelize-52B0E7)
![JWT](https://img.shields.io/badge/Auth-JWT-yellow)

A production-style backend system for managing financial records with **role-based access control (RBAC)**, **analytics dashboards**, and **audit logging**.

Designed to demonstrate **clean architecture, data integrity, and real-world backend patterns**.

---

## 🚀 Overview

This project implements a shared finance backend where:

- Users are managed with roles — **Viewer, Analyst, Admin**
- Financial records are stored, queried, filtered, and analyzed
- Access is strictly controlled per role using RBAC middleware
- Dashboard APIs provide aggregated, real-time financial insights
- Every critical action is tracked via a structured audit log

The system follows a strict **layered architecture**:

```
Request → Routes → Middlewares → Controllers → Services → Repositories → Database
```

Each layer has a single responsibility and no layer skips another.

---

## 🧠 Key Features

### 🔐 Authentication & Security
- JWT-based stateless authentication
- Bearer token extraction and verification middleware
- Specific error messages for expired vs invalid tokens
- Active/inactive user enforcement on every protected route
- Centralized error handling with environment-aware responses

### 👥 User & Role Management
- Admin-controlled user creation
- Role assignment: `VIEWER`, `ANALYST`, `ADMIN`
- Account activation and deactivation
- Secure password hashing with bcrypt

### 💳 Financial Records
- Full CRUD with soft delete — historical data is never lost
- Advanced filtering: date range, category, type (INCOME/EXPENSE)
- Full-text search across notes and category
- Pagination and sorting support
- `DECIMAL(10,2)` precision for financial amounts
- Relational modeling with Sequelize ORM

### 📊 Dashboard Analytics
- Total income, expenses, and net balance
- Category-wise breakdown with totals
- Recent activity feed (configurable limit)
- Monthly income vs expense trends
- Date-range filtering on summary (`startDate`, `endDate`)
- Role-scoped data — viewer sees only summary and recent activity

### 🧾 Audit Logging
- Tracks `CREATE`, `UPDATE`, `DELETE`, `LOGIN` actions
- Records `oldValues` and `newValues` for full change history
- Linked to the acting user for accountability
- Applied across both `User` and `FinancialRecord` operations

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL |
| ORM | Sequelize |
| Authentication | JWT |
| Password Hashing | bcrypt |
| Validation | express-validator |
| Status Codes | http-status-codes |

---

## 📁 Project Structure

```
src/
  controllers/        # HTTP request/response handling
  services/           # Business logic
  repositories/       # Database queries
  routes/             # Route definitions and middleware assignment
  validators/         # express-validator rule sets
  middlewares/        # auth, role, validation, error handling
  utils/              # ApiError, ApiResponse, catchAsync, auditLogger
  database/
    models/           # Sequelize models
    migrations/       # Database schema migrations
    seeders/          # Demo data for testing
  app.js
  server.js
```

---

## 🔐 Role-Based Access Control

| Endpoint | Viewer | Analyst | Admin |
|---|---|---|---|
| `POST /auth/login` | ✅ | ✅ | ✅ |
| `GET /auth/me` | ✅ | ✅ | ✅ |
| `GET /users` | ❌ | ❌ | ✅ |
| `POST /users` | ❌ | ❌ | ✅ |
| `PATCH /users/:id/role` | ❌ | ❌ | ✅ |
| `PATCH /users/:id/status` | ❌ | ❌ | ✅ |
| `GET /records` | ❌ | ✅ | ✅ |
| `GET /records/:id` | ❌ | ✅ | ✅ |
| `POST /records` | ❌ | ❌ | ✅ |
| `PATCH /records/:id` | ❌ | ❌ | ✅ |
| `DELETE /records/:id` | ❌ | ❌ | ✅ |
| `GET /dashboard/summary` | ✅ | ✅ | ✅ |
| `GET /dashboard/recent-activity` | ✅ | ✅ | ✅ |
| `GET /dashboard/category-breakdown` | ❌ | ✅ | ✅ |
| `GET /dashboard/monthly-trends` | ✅ | ✅ | ✅ |

---

## 📡 API Reference

### Auth
```
POST   /api/v1/auth/login       Login and receive JWT
GET    /api/v1/auth/me          Get current authenticated user
```

### Users (Admin only)
```
POST   /api/v1/users            Create a new user
GET    /api/v1/users            Get all users
GET    /api/v1/users/:id        Get user by ID
PATCH  /api/v1/users/:id/role   Update user role
PATCH  /api/v1/users/:id/status Update user status
```

### Financial Records
```
POST   /api/v1/records          Create a record (Admin)
GET    /api/v1/records          Get all records with filters (Analyst, Admin)
GET    /api/v1/records/:id      Get record by ID (Analyst, Admin)
PATCH  /api/v1/records/:id      Update record (Admin)
DELETE /api/v1/records/:id      Soft delete record (Admin)
```

### Dashboard
```
GET    /api/v1/dashboard/summary             Total income, expenses, net balance
GET    /api/v1/dashboard/recent-activity     Latest N records
GET    /api/v1/dashboard/category-breakdown  Totals grouped by type and category
GET    /api/v1/dashboard/monthly-trends      Monthly income vs expense trends
```

### Query Parameters — `GET /records`
```
type        INCOME | EXPENSE
category    string
startDate   ISO8601 date
endDate     ISO8601 date
search      partial match on notes and category
page        default: 1
limit       default: 10, max: 100
sortBy      date | amount | category | createdAt
sortOrder   ASC | DESC
```

---

## 🧾 Audit Log Structure

Every critical action produces an entry:

| Field | Description |
|---|---|
| `userId` | Who performed the action |
| `action` | `CREATE`, `UPDATE`, `DELETE`, `LOGIN` |
| `entity` | `FinancialRecord` or `User` |
| `entityId` | Which specific record was affected |
| `oldValues` | State before the change (`null` for CREATE) |
| `newValues` | State after the change (`null` for DELETE) |
| `createdAt` | When the action occurred |

**Example entry:**
```json
{
  "userId": 3,
  "action": "UPDATE",
  "entity": "FinancialRecord",
  "entityId": 12,
  "oldValues": { "amount": 100, "category": "Food" },
  "newValues": { "amount": 200, "category": "Food" },
  "createdAt": "2026-04-04T10:00:00.000Z"
}
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/hrsh-arcx/finance-backend.git
cd finance-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
```env
PORT=
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=finance_backend

JWT_SECRET=
JWT_EXPIRES_IN=1d
```

### 4. Create the database
```sql
CREATE DATABASE finance_backend;
```

### 5. Run migrations
```bash
npx sequelize-cli db:migrate
```

### 6. Run seeders file
```bash
npx sequelize-cli db:seed:all
```

### 7. Start the server
```bash
npm run dev
```

Server runs at `http://localhost:PORT`

---

## 🔑 Sample Credentials

After running seeds:

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | Admin@123 |
| Analyst | analyst@example.com | Admin@123 |
| Viewer | viewer@example.com | Admin@123 |

---

## 🧪 Example Flow

```
1. POST /api/v1/auth/login         → receive JWT token
2. Set header: Authorization: Bearer <token>
3. POST /api/v1/users              → create analyst user (admin only)
4. POST /api/v1/records            → create financial record (admin only)
5. GET  /api/v1/records?type=INCOME&page=1  → filter records (analyst/admin)
6. GET  /api/v1/dashboard/summary  → view aggregated totals (all roles)
```

---

## 🏛️ Architecture & Design Decisions

### Layered Architecture
Each layer has exactly one responsibility:
- **Controllers** — parse HTTP request, call service, return response
- **Services** — business logic, validation rules, audit logging
- **Repositories** — all Sequelize queries, no business logic

This means services are independently testable without an HTTP context, and the database layer can be swapped without touching business logic.

### Soft Delete for Financial Records
Financial records use an `isDeleted` flag instead of hard deletion. This preserves historical data integrity and ensures audit logs remain meaningful after a record is removed. All queries filter `isDeleted: false` at the repository level.

### Repository Pattern
All database queries are isolated in repository files. Services never import Sequelize or `db` directly. This keeps business logic portable and makes it straightforward to change query behavior in one place.

### Centralized Error Handling
A single `errorMiddleware` handles all errors. In production, unexpected errors return a generic message to prevent leaking internal details. In development, the full error is returned for easier debugging.

### `catchAsync` Utility
All controllers use a `catchAsync` wrapper that eliminates try/catch boilerplate. Errors automatically flow to the centralized error handler via `next(error)`.

### RBAC Middleware
Role enforcement is handled by a `roleMiddleware` factory applied per route. This keeps access control declarative and visible at the route level rather than buried in controller logic.

### Audit Logging in the Service Layer
Audit logs are written in the service layer rather than using Sequelize hooks. This gives direct access to `userId` from the authenticated request and makes logging explicit, controllable, and easy to customize per action.

### `DECIMAL(10,2)` for Amounts
Financial amounts use MySQL `DECIMAL` type to avoid floating-point precision errors. Validator enforces a maximum of 2 decimal places and a minimum value of `0.01`.

### Query-driven Dashboard
Dashboard analytics use Sequelize aggregate functions (`SUM`, `COUNT`, `DATE_FORMAT`) with `GROUP BY` rather than fetching all records and computing in JavaScript. This keeps analytics performant as data grows.

---

## ⚠️ Assumptions

- Financial records represent a **shared company dataset** — all authorized users see all records
- Roles define **access level**, not data ownership
- Viewer users access only aggregated dashboard insights — no raw record access
- Users are never hard deleted — `RESTRICT` foreign key constraint protects audit trail integrity

---

## 📌 Future Improvements

- Per-user data ownership model
- Export reports as CSV or PDF
- Redis caching for dashboard queries
- Rate limiting on auth endpoints
- Unit and integration test coverage
- Refresh token support

---

## 👨‍💻 Author

**Harsh Goel**
[GitHub](https://github.com/hrsh-arcx) 
[LinkedIn](https://www.linkedin.com/in/harsh-goel-090a00315/)
