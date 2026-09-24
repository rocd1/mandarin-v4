# Django + Angular Terminal Commands Reference

A practical command reference for creating, running, testing, and maintaining a Django + Django REST Framework + Angular project.

The examples assume:

* Windows
* PowerShell
* Django backend
* Angular frontend
* Python virtual environment
* Angular standalone components
* CSS
* No SSR
* Git

---

# 1. Basic Windows Terminal Commands

## Show current directory

```powershell
pwd
```

or:

```powershell
Get-Location
```

---

## List files and folders

```powershell
dir
```

or:

```powershell
ls
```

---

## Change directory

```powershell
cd folder-name
```

Example:

```powershell
cd E:\django-projects
```

---

## Go up one directory

```powershell
cd ..
```

---

## Create a directory

```powershell
mkdir project-name
```

Example:

```powershell
mkdir project-app-starter
```

---

## Clear terminal

```powershell
Clear-Host
```

or:

```powershell
cls
```

---

## Stop a running server

```text
Ctrl + C
```

This is commonly used to stop:

```text
Django runserver
Angular ng serve
```

---

# 2. Create a Django Project

## Create project directory

```powershell
mkdir project-app-starter
cd project-app-starter
```

Create the backend directory:

```powershell
mkdir backend
cd backend
```

---

# 3. Create Python Virtual Environment

Create the virtual environment:

```powershell
python -m venv venv
```

Activate it in PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

You should then see something similar to:

```text
(venv)
```

at the beginning of the terminal prompt.

---

## Deactivate virtual environment

```powershell
deactivate
```

---

# 4. Check Python

```powershell
python --version
```

You can also use:

```powershell
python -V
```

---

# 5. Upgrade pip

```powershell
python -m pip install --upgrade pip
```

Using:

```text
python -m pip
```

is preferable to relying on a separately resolved `pip` executable.

---

# 6. Install Django

```powershell
pip install django
```

Or:

```powershell
python -m pip install django
```

---

# 7. Install Django REST Framework

```powershell
pip install djangorestframework
```

---

# 8. Install SimpleJWT

```powershell
pip install djangorestframework-simplejwt
```

---

# 9. Install CORS Headers

```powershell
pip install django-cors-headers
```

---

# 10. Install Pillow

Needed when using Django image fields such as avatars.

```powershell
pip install pillow
```

---

# 11. Create `requirements.txt`

After installing the project's dependencies:

```powershell
pip freeze > requirements.txt
```

This records the installed Python packages and versions.

A future project can then install them with:

```powershell
pip install -r requirements.txt
```

---

# 12. Create Django Project

From the backend directory:

```powershell
django-admin startproject config .
```

The `.` means:

> Create the Django project in the current directory.

This gives you a structure similar to:

```text
backend/
├── manage.py
└── config/
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    ├── asgi.py
    └── wsgi.py
```

---

# 13. Create Django Apps

Create an application:

```powershell
python manage.py startapp accounts
```

Other examples:

```powershell
python manage.py startapp learning
python manage.py startapp vocabulary
```

The command format is:

```powershell
python manage.py startapp APP_NAME
```

---

# 14. Check Django Configuration

Run:

```powershell
python manage.py check
```

This checks the Django project for configuration problems.

This is useful before migrations or starting the server.

---

# 15. Create Migrations

After changing Django models:

```powershell
python manage.py makemigrations
```

This creates migration files describing database changes.

---

# 16. Apply Migrations

```powershell
python manage.py migrate
```

This applies pending migrations to the database.

Typical workflow:

```text
Change model
    ↓
makemigrations
    ↓
migrate
```

---

# 17. Create Superuser

```powershell
python manage.py createsuperuser
```

Django will ask for the required credentials.

---

# 18. Run Django Development Server

```powershell
python manage.py runserver
```

Default address:

```text
http://127.0.0.1:8000/
```

You can also explicitly use:

```powershell
python manage.py runserver 127.0.0.1:8000
```

---

# 19. Run Django on Another Port

Example:

```powershell
python manage.py runserver 8001
```

---

# 20. Django Shell

Open Django's interactive shell:

```powershell
python manage.py shell
```

Useful for testing models, users, queries, and application logic.

Exit:

```text
exit()
```

---

# 21. Django Tests

Run all Django tests:

```powershell
python manage.py test
```

Run tests for one app:

```powershell
python manage.py test accounts
```

Run a specific test module:

```powershell
python manage.py test accounts.tests
```

---

# 22. Django URL / API Testing

The browser can be used for GET endpoints.

For example:

```text
http://localhost:8000/api/auth/csrf/
```

For API requests that require POST/PUT/PATCH/DELETE, use the frontend, an API client, or another HTTP testing tool rather than relying on browser navigation.

---

# 23. Angular / Node Environment

Before creating an Angular project, check Node:

```powershell
node --version
```

or:

```powershell
node -v
```

Check npm:

```powershell
npm --version
```

or:

```powershell
npm -v
```

Check Angular CLI:

```powershell
ng version
```

The development environment used for this starter was:

```text
Node     24.11.1
npm      11.6.2
Angular  21.2.21
```

---

# 24. Install Angular CLI

Install Angular CLI globally:

```powershell
npm install -g @angular/cli
```

Then verify:

```powershell
ng version
```

---

# 25. Create Angular Application

From the project root:

```powershell
ng new frontend
```

For this starter, the important choices were:

```text
Routing       → according to the Angular setup
Stylesheet    → CSS
SSR/SSG       → No
Standalone    → Yes
```

The exact CLI prompts can change between Angular versions, so follow the prompts shown by the installed CLI.

---

# 26. Enter Angular Project

```powershell
cd frontend
```

---

# 27. Start Angular Development Server

```powershell
ng serve
```

Angular normally becomes available at:

```text
http://localhost:4200/
```

---

# 28. Start Angular and Open Browser

```powershell
ng serve --open
```

This starts the development server and opens the application in the browser.

---

# 29. Stop Angular Server

```text
Ctrl + C
```

---

# 30. Generate Angular Component

General command:

```powershell
ng generate component COMPONENT_NAME
```

Short form:

```powershell
ng g c COMPONENT_NAME
```

Example:

```powershell
ng g c pages/profile
```

---

# 31. Generate Component in a Specific Folder

Example:

```powershell
ng g c pages/dashboard
```

This creates the component under:

```text
src/app/pages/dashboard/
```

---

# 32. Generate Nested Component

Example:

```powershell
ng g c layouts/designs/app/headers/profile/profile-header
```

This is useful for the design library.

---

# 33. Generate a Service

General command:

```powershell
ng generate service SERVICE_NAME
```

Short form:

```powershell
ng g s SERVICE_NAME
```

Example:

```powershell
ng g s core/auth/services/auth
```

---

# 34. Generate a Guard

General command:

```powershell
ng generate guard GUARD_NAME
```

Short form:

```powershell
ng g guard GUARD_NAME
```

Example:

```powershell
ng g guard core/guards/auth-guard
```

Angular may ask which guard type to generate depending on the CLI version.

---

# 35. Generate an Interceptor

General command:

```powershell
ng generate interceptor INTERCEPTOR_NAME
```

Short form:

```powershell
ng g interceptor INTERCEPTOR_NAME
```

Example:

```powershell
ng g interceptor core/interceptors/auth
```

---

# 36. Generate an Interface

General command:

```powershell
ng generate interface PATH/NAME
```

Short form:

```powershell
ng g interface PATH/NAME
```

Example:

```powershell
ng g interface core/auth/models/auth
```

---

# 37. Generate a Class

```powershell
ng generate class PATH/NAME
```

Short form:

```powershell
ng g class PATH/NAME
```

Use this when a real class is required rather than a component or service.

---

# 38. Generate a TypeScript Enum

```powershell
ng generate enum PATH/NAME
```

Short form:

```powershell
ng g enum PATH/NAME
```

Use enums only when they provide a clear benefit.

---

# 39. Angular Development Build

The normal development workflow uses:

```powershell
ng serve
```

For a production build:

```powershell
ng build
```

---

# 40. Angular Production Build

```powershell
ng build --configuration production
```

The production build verifies that the application can be compiled for deployment.

---

# 41. Angular Tests

Run the Angular test suite:

```powershell
ng test
```

Depending on the Angular version and test setup, this may start the test runner in watch mode.

---

# 42. Angular Tests Without Watch Mode

For CI-style testing, Angular CLI versions may support:

```powershell
ng test --watch=false
```

Use the options supported by the installed Angular CLI version.

---

# 43. Run a Specific Angular Test File

Angular CLI test filtering depends on the configured test runner.

The simplest general workflow is:

```powershell
ng test
```

and then use the test runner's filtering/debugging facilities when needed.

Do not assume every Angular version supports the same test flags.

---

# 44. Check Angular Project

Angular provides:

```powershell
ng build
```

as an effective compilation check.

For a quick development check:

```powershell
ng serve
```

If compilation fails, Angular reports the TypeScript/template errors in the terminal.

---

# 45. npm Install

Install dependencies from `package.json`:

```powershell
npm install
```

This is particularly useful after cloning a project.

Typical workflow:

```text
Clone project
    ↓
cd frontend
    ↓
npm install
    ↓
ng serve
```

---

# 46. Install an npm Package

General:

```powershell
npm install PACKAGE_NAME
```

Example:

```powershell
npm install some-package
```

---

# 47. Install a Development Dependency

```powershell
npm install --save-dev PACKAGE_NAME
```

---

# 48. Remove an npm Package

```powershell
npm uninstall PACKAGE_NAME
```

---

# 49. Check npm Packages

```powershell
npm list
```

For top-level packages:

```powershell
npm list --depth=0
```

---

# 50. npm Audit

Check known dependency vulnerabilities:

```powershell
npm audit
```

Request npm's automatic fixes where appropriate:

```powershell
npm audit fix
```

Do not blindly run aggressive dependency upgrades on a stable starter without reviewing the changes.

---

# 51. Update Angular Dependencies

Check outdated packages:

```powershell
npm outdated
```

Angular upgrades should normally be handled deliberately using Angular's upgrade tooling rather than randomly updating every package.

Check Angular CLI help:

```powershell
ng update
```

---

# 52. Angular Help

If you forget a command:

```powershell
ng help
```

For a specific command:

```powershell
ng generate --help
```

or:

```powershell
ng serve --help
```

---

# 53. Git — Initialize Repository

From the project root:

```powershell
git init
```

---

# 54. Git — Check Status

```powershell
git status
```

This is one of the most useful Git commands.

Use it frequently.

---

# 55. Git — Add Files

Add everything:

```powershell
git add .
```

Add a specific file:

```powershell
git add path/to/file
```

---

# 56. Git — Commit

```powershell
git commit -m "Add authentication architecture"
```

Use clear commit messages describing the completed change.

Examples:

```powershell
git commit -m "Add authentication architecture"
```

```powershell
git commit -m "Add reusable layout designs"
```

```powershell
git commit -m "Finalize page architecture"
```

---

# 57. Git — View Commit History

```powershell
git log
```

Compact version:

```powershell
git log --oneline
```

---

# 58. Git — Create a Branch

```powershell
git switch -c feature-name
```

Example:

```powershell
git switch -c feature/profile-page
```

---

# 59. Git — Switch Branch

```powershell
git switch branch-name
```

---

# 60. Git — List Branches

```powershell
git branch
```

---

# 61. Git — Pull

```powershell
git pull
```

Use this when working with a remote repository and you need the latest changes.

---

# 62. Git — Push

```powershell
git push
```

For a new branch where the upstream has not been configured:

```powershell
git push -u origin branch-name
```

---

# 63. Git — View Remote

```powershell
git remote -v
```

---

# 64. Git — Add Remote

```powershell
git remote add origin REMOTE_URL
```

Example:

```powershell
git remote add origin <repository-url>
```

---

# 65. Git — Restore an Unstaged File

```powershell
git restore path/to/file
```

Be careful: this discards uncommitted changes in that file.

---

# 66. Git — Unstage a File

```powershell
git restore --staged path/to/file
```

This removes the file from the staging area without deleting your changes.

---

# 67. Git — View Changes

Unstaged changes:

```powershell
git diff
```

Staged changes:

```powershell
git diff --staged
```

---

# 68. Git — Tags

List tags:

```powershell
git tag
```

Create a version tag:

```powershell
git tag v1.0.0
```

Push a tag:

```powershell
git push origin v1.0.0
```

---

# 69. Git — Checkout a Tag

For inspecting an existing version:

```powershell
git checkout v1.0.0
```

Modern Git can also use:

```powershell
git switch --detach v1.0.0
```

For normal development, prefer branches rather than working directly from a tag.

---

# 70. Useful Project Startup Workflow

For a new Django + Angular project:

```text id="9fn7p0"
Create project
    ↓
Create backend
    ↓
Create Python venv
    ↓
Install Django/DRF/dependencies
    ↓
Create Django project
    ↓
Create Django apps
    ↓
Configure backend
    ↓
Run migrations
    ↓
Create Angular application
    ↓
Install frontend dependencies
    ↓
Configure Angular
    ↓
Run backend + frontend
```

Typical commands:

```powershell
mkdir project-name
cd project-name

mkdir backend
cd backend

python -m venv venv
.\venv\Scripts\Activate.ps1

python -m pip install --upgrade pip
pip install django
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
pip install pillow

pip freeze > requirements.txt

django-admin startproject config .

python manage.py migrate
python manage.py runserver
```

Then in another terminal:

```powershell
cd project-name

ng new frontend
cd frontend

npm install
ng serve
```

---

# 71. Daily Development Workflow

When continuing an existing project:

### Terminal 1 — Django

```powershell
cd E:\django-projects\project-app-starter\backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

### Terminal 2 — Angular

```powershell
cd E:\django-projects\project-app-starter\frontend
ng serve
```

Then:

```text
Angular
http://localhost:4200/

Django
http://localhost:8000/
```

---

# 72. After Changing Django Models

Use:

```powershell
python manage.py makemigrations
python manage.py migrate
```

Then run tests:

```powershell
python manage.py test
```

---

# 73. After Changing Angular Code

Usually:

```powershell
ng serve
```

Angular's development server watches for changes automatically.

Before committing:

```powershell
ng test
```

and:

```powershell
ng build
```

---

# 74. Before a Commit

A useful final check:

```powershell
git status
```

Then:

```powershell
python manage.py check
```

Backend tests:

```powershell
python manage.py test
```

Frontend tests:

```powershell
ng test
```

Frontend build:

```powershell
ng build
```

Then inspect changes:

```powershell
git diff
```

Finally:

```powershell
git add .
git commit -m "Describe completed change"
```

---

# 75. Quick Command Cheat Sheet

## Django

```powershell
python --version
python -m venv venv
.\venv\Scripts\Activate.ps1
deactivate

python -m pip install --upgrade pip
pip install django
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
pip install pillow

pip freeze > requirements.txt
pip install -r requirements.txt

django-admin startproject config .
python manage.py startapp APP_NAME

python manage.py check
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

python manage.py runserver
python manage.py shell
python manage.py test
```

---

## Angular

```powershell
node -v
npm -v
ng version

npm install -g @angular/cli

ng new frontend
cd frontend

npm install
ng serve
ng serve --open

ng generate component PATH
ng generate service PATH
ng generate guard PATH
ng generate interceptor PATH
ng generate interface PATH

ng test
ng build
ng build --configuration production

npm list --depth=0
npm outdated
npm audit
```

---

## Git

```powershell
git init
git status

git add .
git commit -m "Message"

git log --oneline

git branch
git switch -c branch-name
git switch branch-name

git diff
git diff --staged

git remote -v
git pull
git push

git tag
git tag v1.0.0
```

---

# 76. The Most Important Commands to Memorize

As a beginner, you do **not** need to memorize the entire list.

Start with these:

### Navigation

```powershell
cd
cd ..
dir
mkdir
```

### Python/Django

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python manage.py runserver
python manage.py check
python manage.py makemigrations
python manage.py migrate
python manage.py test
```

### Angular

```powershell
ng version
ng serve
ng generate component
ng generate service
ng test
ng build
```

### npm

```powershell
npm install
npm install PACKAGE_NAME
npm uninstall PACKAGE_NAME
npm audit
```

### Git

```powershell
git status
git add .
git commit -m "message"
git log --oneline
git diff
```

You will naturally memorize the commands you use repeatedly.

---

# 77. Command Mindset

The most important thing is not memorizing commands.

Understand what category the command belongs to:

```text id="9ryg4a"
Python
  → manages Python environment

pip
  → manages Python packages

Django
  → manages backend project

npm
  → manages JavaScript packages

Angular CLI (ng)
  → manages Angular application

Git
  → manages source-code history
```

A useful mental model is:

```text id="v1t8px"
Operating System
        │
        ├── cd / mkdir / dir
        │
        ▼
Python Environment
        │
        ├── venv
        └── pip
        │
        ▼
Django
        │
        ├── manage.py
        ├── migrations
        └── runserver
        │
        ├─────────────────┐
        ▼                 ▼
     Angular             Git
        │                 │
        ├── ng            ├── add
        ├── npm           ├── commit
        ├── test          ├── branch
        └── build         └── history
```

The goal is to understand **which tool you are talking to and why**, rather than memorizing every command.

---

# 78. Recommended Future Project Order

For a new Django + Angular starter-based project, the general command sequence is:

```text
1. Create project directory
2. Create backend
3. Create Python virtual environment
4. Activate venv
5. Install backend dependencies
6. Create Django project
7. Create Django apps
8. Configure Django
9. Run migrations
10. Create Angular application
11. Install frontend dependencies
12. Configure Angular
13. Start Django
14. Start Angular
15. Build features
16. Test
17. Build
18. Commit
```

This sequence is a reference guide, not a rigid rule. Some projects will require additional commands as their requirements grow.


```
To see project tree

tree /F src

```