# Student Registration System

A full-stack Student Registration System built using Angular and ASP.NET Core Web API.

## Technologies Used

### Frontend
- Angular 20
- TypeScript
- HTML
- CSS
- Bootstrap

### Backend
- ASP.NET Core Web API
- PostgreSQL

---

# Project Structure

```bash
project-root/
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── angular.json
│
├── backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   ├── Program.cs
│   ├── appsettings.json
│
└── README.md
```

---

# Features

- Student Registration
- Form Validation
- API Integration
- PostgreSQL Database Connection
- Responsive UI

---

# Installation

## Frontend Setup

```bash
cd frontend
npm install
ng serve
```

Frontend runs on:

```bash
http://localhost:4200
```

---

## Backend Setup

```bash
cd backend
dotnet restore
dotnet run
```

Backend runs on:

```bash
https://localhost:5001
```

---

# Database Configuration

Update PostgreSQL connection string in:

```bash
appsettings.json
```

Example:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=StudentDB;Username=postgres;Password=yourpassword"
}
```

---

# API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/students | Get all students |
| POST | /api/students | Add new student |

---

# Future Enhancements

- Login Authentication
- Admin Dashboard
- Student Search
- Pagination
- File Upload

---

# Author

Developed by Dharanish
