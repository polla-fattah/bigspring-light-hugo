# Salahaddin University-Erbil Research Center (SURC) Web Platform

A modern full-stack web application and research management portal for the **Salahaddin University-Erbil Research Center (SURC)** powered by Next.js, React 19, Tailwind CSS, Prisma ORM, and PostgreSQL.

---

## 🏛️ Technology Stack

- **Frontend Application:** Next.js 16 (App Router) + React 19 + Tailwind CSS (Port `3001`)
- **Backend API Server:** Next.js App Router REST API + Prisma ORM (Port `3000`)
- **Database:** PostgreSQL 15 (Port `5432`)
- **Authentication:** NextAuth v5 (Auth.js) with JWT Sessions
- **Orchestration:** Docker & Docker Compose

---

## 📁 Project Structure

```
.
├── dynamic/
│   ├── backend/             # Next.js REST API Server & Database Models
│   │   ├── app/api/         # API Routes (units, staff, projects, publications, labs, etc.)
│   │   ├── prisma/          # Prisma Schema & Database Seed Scripts
│   │   └── package.json
│   └── frontend/            # Next.js Web Application & Admin Portal
│       ├── app/             # Public & Admin Page Routes
│       ├── components/      # UI Components (Navbar, Forms, Dashboards)
│       └── package.json
├── migration/               # Data Extraction & Migration Scripts
│   └── content_data.json   # Processed JSON Dataset seeded into PostgreSQL
├── legacy_hugo/             # Archived Hugo files (for reference/backup)
├── docker-compose.yml       # Production/Dev Docker Compose setup
├── package.json             # Root workspace scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v20+ 
- PostgreSQL 15 running on port 5432 (or Docker Desktop)

### 1. Seed Database
Ingest all research units, publications, projects, staff profiles, datasets, and lab equipment into PostgreSQL:
```bash
npm run db:seed
```

### 2. Start Development Servers
Run both Backend REST API and Frontend Web Portal:
```bash
npm run dev
```

The services will be available at:
- **Web Portal UI:** [http://localhost:3001](http://localhost:3001)
- **Admin Login:** [http://localhost:3001/admin/login](http://localhost:3001/admin/login)
- **Backend REST API:** [http://localhost:3000](http://localhost:3000)

### 3. Run with Docker Compose
To run all services (PostgreSQL + Backend + Frontend) in isolated containers:
```bash
docker compose up --build
```

---

## 🔒 Administrative Access

* **Portal Login:** `/admin/login`
* **Default Superadmin:** `admin@su.edu.krd`
* **Roles Supported:** `superadmin`, `lab_staff`, `researcher`
