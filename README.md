# Project App Starter

A reusable full-stack starter template built with **Django REST Framework** and **Angular**.

The project provides a secure foundation for building web applications with cookie-based JWT authentication, CSRF protection, protected routes, reusable layouts, and a clean frontend/backend separation.

## Stack

### Backend

* Django 6
* Django REST Framework
* SimpleJWT
* Cookie-based JWT authentication
* CSRF protection
* CORS configuration

### Frontend

* Angular
* Standalone components
* TypeScript
* Reactive Forms
* Angular Router
* HttpClient
* Route guards
* HTTP interceptors
* Reusable layouts and UI designs

## Project Structure

```text
project-app-starter/
├── backend/      # Django + DRF backend
├── frontend/     # Angular frontend
├── .gitignore
└── README.md
```

### Backend

```text
backend/
├── config/       # Django project configuration
├── accounts/     # Authentication and user functionality
└── manage.py
```

### Frontend

```text
frontend/
└── src/app/
    ├── core/     # Application infrastructure
    ├── layouts/  # Page composition and reusable designs
    ├── pages/    # Route-level pages
    └── shared/   # Reusable UI primitives
```

## Authentication

Authentication uses **JWTs stored in HttpOnly cookies**.

* Access and refresh tokens are not stored in `localStorage` or `sessionStorage`.
* CSRF protection is enabled for state-changing requests.
* Angular automatically sends credentials through the HTTP interceptor.
* Protected routes use an Angular authentication guard.
* The backend remains the final authority for authentication and authorization.
* Refresh-token rotation and blacklisting are supported.

## Running the Project

### Backend

```bash
cd backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Run Django
python manage.py runserver
```

Backend:

```text
http://localhost:8000/
```

### Frontend

Open another terminal:

```bash
cd frontend

# Install dependencies if needed
npm install

# Start Angular
ng serve
```

Frontend:

```text
http://localhost:4200/
```

## Development Flow

```text
Browser
   │
   ▼
Angular
   │
   │ HTTP + HttpOnly Cookies
   ▼
Django REST API
   │
   ▼
Database
```

The Angular application handles the user interface and client-side application flow, while Django/DRF handles authentication, authorization, validation, business logic, and data access.

## Documentation

More detailed documentation is available inside the project:

* `frontend/src/app/README.md` — Angular architecture
* `frontend/src/app/LEARNING-NOTES.md` — Angular beginner notes
* `frontend/src/app/TERMINAL-COMMANDS.md` — development command reference

## Purpose

This project is intended to be a **reusable starting point** for future Django + Angular applications.

Application-specific features should be built on top of this starter rather than changing the starter's core security and architecture unnecessarily.


### Note:

Delete after each successful new built project

auth-test  
`E:\django-projects\project-app-starter\frontend\src\app\pages\auth-test`

request-state-test `E:\django-projects\project-app-starter\frontend\src\app\pages\request-state-test`

Notes
`E:\django-projects\project-app-starter\frontend\notes`

### Runserver
```
(venv) PS E:\django-projects\project-app-starter\backend> 
python manage.py runserver localhost:8000
```


### Structure

```
project-app-starter/
├── .gitignore          
├── README.md
├── CHANGELOG.md
├── LICENSE
├── backend/
└── frontend/
```