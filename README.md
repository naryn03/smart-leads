# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack + TypeScript.

![Stack](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7-green?logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-blue?logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker)

---

## Features

- **JWT Authentication** — register, login, protected routes, bcrypt password hashing
- **Lead CRUD** — create, read, update, delete leads with full validation
- **Advanced Filtering** — filter by status + source + search (all combined), sort by latest/oldest
- **Debounced Search** — 400ms debounce on name/email search
- **Backend Pagination** — 10 records/page, skip/limit, metadata in response
- **CSV Export** — export current filtered view as a CSV file
- **Role-Based Access Control** — Admin (full access) vs Sales (own leads only, no delete)
- **Dark Mode** — system preference + manual toggle, persisted to localStorage
- **Responsive UI** — works on mobile, tablet, desktop
- **Docker** — full Docker Compose setup with MongoDB, backend, and frontend
- **Clean TypeScript** — no `any`, proper interfaces throughout

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, TypeScript, TailwindCSS, Vite |
| State     | Zustand, TanStack Query v5              |
| Backend   | Node.js, Express.js, TypeScript         |
| Database  | MongoDB, Mongoose                       |
| Auth      | JWT, bcryptjs                           |
| Docker    | Docker Compose (mongo + api + nginx)    |

---

## Project Structure

```
smart-leads/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # authController, leadController
│   │   ├── middleware/      # auth, validation, errorHandler
│   │   ├── models/         # User, Lead (Mongoose)
│   │   ├── routes/         # /auth, /leads
│   │   ├── types/          # Shared TypeScript types
│   │   ├── utils/          # response helpers, JWT
│   │   └── index.ts        # Express app entry
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/         # Spinner, Pagination, EmptyState, ConfirmDialog, StatusBadge
│   │   │   ├── layout/     # Layout (sidebar + outlet)
│   │   │   ├── leads/      # LeadTable, LeadModal, FiltersBar
│   │   │   └── dashboard/  # StatCard
│   │   ├── hooks/          # useDebounce
│   │   ├── pages/          # LoginPage, RegisterPage, DashboardPage, LeadsPage
│   │   ├── services/       # api.ts (axios), authService, leadsService
│   │   ├── store/          # authStore (Zustand), themeStore
│   │   ├── types/          # index.ts (all TS interfaces)
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn
- Docker + Docker Compose (optional)

---

### Option A — Run Locally (Without Docker)

#### 1. Clone and setup

```bash
git clone https://github.com/YOUR_USERNAME/smart-leads.git
cd smart-leads
```

#### 2. Setup Backend

```bash
cd backend
cp .env.example .env
# Edit .env and set your MONGODB_URI and JWT_SECRET
npm install
npm run dev
# Backend runs at http://localhost:5000
```

#### 3. Setup Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:3000
```

#### 4. Open the app

Visit **http://localhost:3000** and register an account (choose Admin role for full access).

---

### Option B — Run with Docker Compose

#### 1. Setup environment

```bash
cp .env.example .env
# Edit .env — set a strong JWT_SECRET
```

#### 2. Build and start all services

```bash
docker-compose up --build
```

This starts:
- MongoDB on port `27017`
- Backend API on port `5000`
- Frontend (nginx) on port `3000`

#### 3. Open the app

Visit **http://localhost:3000**

#### 4. Stop services

```bash
docker-compose down          # stop containers
docker-compose down -v       # stop + delete MongoDB data
```

---

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth Endpoints

| Method | Route           | Access | Description       |
|--------|-----------------|--------|-------------------|
| POST   | /auth/register  | Public | Register new user |
| POST   | /auth/login     | Public | Login user        |
| GET    | /auth/me        | Auth   | Get current user  |

**POST /auth/register**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "admin"  // "admin" | "sales" (optional, default: "sales")
}
```

**POST /auth/login**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response (both auth endpoints)**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "...", "role": "admin" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Leads Endpoints

All routes require `Authorization: Bearer <token>` header.

| Method | Route              | Role        | Description            |
|--------|--------------------|-------------|------------------------|
| GET    | /leads             | Auth        | List leads (paginated) |
| GET    | /leads/:id         | Auth        | Get single lead        |
| POST   | /leads             | Auth        | Create lead            |
| PUT    | /leads/:id         | Auth        | Update lead            |
| DELETE | /leads/:id         | Admin only  | Delete lead            |
| GET    | /leads/stats       | Auth        | Get stats/overview     |
| GET    | /leads/export      | Auth        | Export CSV             |

**GET /leads — Query Parameters**

| Param    | Type   | Values                               | Description          |
|----------|--------|--------------------------------------|----------------------|
| status   | string | New, Contacted, Qualified, Lost      | Filter by status     |
| source   | string | Website, Instagram, Referral         | Filter by source     |
| search   | string | any                                  | Search name/email    |
| sort     | string | latest (default), oldest             | Sort order           |
| page     | number | default: 1                           | Page number          |
| limit    | number | default: 10, max: 100                | Records per page     |

**Example**: `GET /leads?status=Qualified&source=Instagram&search=rahul&sort=latest&page=1&limit=10`

**Response**
```json
{
  "success": true,
  "data": [...leads],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**POST /leads — Request Body**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram",
  "notes": "Met at conference"
}
```

---

### Error Response Format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Valid email is required" }
  ]
}
```

---

## Role-Based Access

| Feature               | Admin | Sales User          |
|-----------------------|-------|---------------------|
| View own leads        | ✅    | ✅                  |
| View all leads        | ✅    | ❌ (own only)       |
| Create leads          | ✅    | ✅                  |
| Update leads          | ✅    | ✅ (own only)       |
| Delete leads          | ✅    | ❌                  |
| Export CSV            | ✅    | ✅ (own leads)      |
| Dashboard stats       | ✅    | ✅ (own leads)      |

---

## Deployment

### Deploy Backend to Render

1. Create account at [render.com](https://render.com)
2. New → Web Service → connect your GitHub repo
3. Root Directory: `backend`
4. Build Command: `npm install && npm run build`
5. Start Command: `node dist/index.js`
6. Add environment variables (MONGODB_URI, JWT_SECRET, FRONTEND_URL, NODE_ENV=production)

### Deploy Frontend to Vercel

1. Create account at [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Root Directory: `frontend`
4. Framework Preset: Vite
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add env var: `VITE_API_URL=https://your-render-backend-url.onrender.com`

### Deploy MongoDB

Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier):
1. Create cluster → get connection string
2. Paste into `MONGODB_URI` on Render

---

## Git Workflow

```bash
git init
git add .
git commit -m "feat: initial project setup with MERN stack

- JWT auth with bcrypt password hashing
- Lead CRUD with validation
- Advanced filtering, search (debounced), pagination
- CSV export
- RBAC (admin/sales)
- Dark mode
- Docker Compose setup"

git remote add origin https://github.com/YOUR_USERNAME/smart-leads.git
git branch -M main
git push -u origin main
```

---

## Environment Variables Reference

| Variable       | Required | Description                        |
|----------------|----------|------------------------------------|
| PORT           | No       | Backend port (default 5000)        |
| MONGODB_URI    | Yes      | MongoDB connection string          |
| JWT_SECRET     | Yes      | Secret key for JWT signing (32+ chars) |
| JWT_EXPIRES_IN | No       | Token expiry (default 7d)          |
| NODE_ENV       | No       | development / production           |
| FRONTEND_URL   | No       | CORS origin (default localhost:3000) |

---

## License

MIT
