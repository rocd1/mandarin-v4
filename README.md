# Mandarin Learning App

A Mandarin vocabulary learning app built with Django REST Framework and Angular. The goal is to help learners improve their Chinese vocabulary through HSK-based study and quizzes.

## Features

* **HSK vocabulary:** Browse vocabulary organized by HSK level.
* **Vocabulary study:** Review Chinese characters, pinyin, and English meanings.
* **Multiple quiz types:**

  * Hanzi to Meaning
  * Meaning to Hanzi
  * Hanzi to Pinyin
  * Pinyin to Hanzi
* **Guest access:** Study vocabulary and take quizzes without creating an account.
* **User authentication:** Register, log in, and access protected pages.
* **Learning progress:** Authenticated users can track correct and incorrect answers.
* **Responsive interface:** Desktop header and mobile bottom navigation in the authenticated dashboard.

## Tech Stack

**Backend**

* Python
* Django
* Django REST Framework
* JWT cookie authentication
* SQLite for development

**Frontend**

* Angular
* TypeScript
* HTML and CSS

## Project Structure

```text
mandarin-v4/
├── backend/
│   ├── manage.py
│   ├── config/
│   └── learning/
│       └── data/
│           ├── 1.json
│           ├── 2.json
│           ├── ...
│           └── 7.json
│
├── frontend/
│   ├── src/
│   ├── angular.json
│   └── package.json
│
└── README.md
```

## Getting Started

### Requirements

Install the following before running the project:

* Python
* Node.js and npm
* Angular CLI
* Git (optional)

### 1. Run the Backend

Open a terminal and navigate to the backend folder.

```powershell
cd backend
```

Activate your Python virtual environment, then install the project dependencies if you have not already done so.

Run database migrations:

```powershell
python manage.py migrate
```

Start the Django development server:

```powershell
python manage.py runserver
```

The backend will normally be available at:

`http://127.0.0.1:8000/`

### 2. Run the Frontend

Open a second terminal:

```powershell
cd frontend
```

Install dependencies if needed:

```powershell
npm install
```

Start the Angular development server:

```powershell
ng serve
```

The frontend will normally be available at:

`http://localhost:4200/`

### 3. Configure Environment Variables

Before running the application, make sure the backend environment variables are configured using your project's environment template.

Do not commit secret keys, database credentials, or other sensitive values to Git.

## Vocabulary Dataset

The app uses the [Complete HSK Vocabulary dataset](https://github.com/drkameleon/complete-hsk-vocabulary).

The imported vocabulary is organized into HSK levels 1–9 and includes fields such as:

* Simplified and traditional Chinese
* Pinyin
* Numeric pinyin
* English meanings
* Parts of speech
* Radicals and other vocabulary information

The current import contains approximately 10,057 vocabulary entries.

If you need to import the dataset into a fresh database, place the required JSON files in the expected data directory and run the project's import command:

```powershell
python manage.py import_vocabulary
```

## Application Routes

| Route                                 | Purpose             | Access        |
| ------------------------------------- | ------------------- | ------------- |
| `/`                                   | Landing page        | Public        |
| `/login`                              | Login               | Public        |
| `/register`                           | Registration        | Public        |
| `/guest`                              | Guest entry         | Public        |
| `/learning`                           | HSK selection       | Public        |
| `/learning/hsk/:level`                | Study vocabulary    | Public        |
| `/learning/hsk/:level/quiz`           | Quiz type selection | Public        |
| `/learning/hsk/:level/quiz/:quizType` | Take a quiz         | Public        |
| `/app`                                | Dashboard           | Authenticated |

## Authentication and Security

* JWTs are stored in HTTP-only cookies rather than browser storage.
* CSRF protection is used for applicable state-changing requests.
* Protected application routes require authentication.
* Guest users can use public study and quiz pages.
* Learning progress is associated with authenticated users.

## Development Notes

* Run the Django backend and Angular frontend in separate terminals.
* Keep backend validation authoritative for authentication and quiz answers.
* Do not log passwords, JWTs, or other sensitive authentication data.
* Test guest access, login, logout, quiz submissions, and progress updates after making changes.

## Project Goal

Build a straightforward and reusable Mandarin vocabulary learning experience that helps learners improve their HSK vocabulary through regular study and practice.
