# Project App Starter — Angular Learning Notes

This README is a learning record for the Angular frontend starter project.

The goal is not only to remember **what commands were used**, but to understand **why each folder and file exists** and how the pieces work together.

---

# 1. What We Are Building

This frontend is a reusable Angular starter that works with our secure Django backend.

Current stack:

- Angular CLI: 21.2.22
- Angular: 21.2.22
- TypeScript: 5.9.3
- RxJS: 7.8.2
- Frontend development server: `http://localhost:4200`
- Django API: `http://localhost:8000`

The starter is intentionally generic.

It does **not** contain Mandarin-learning concepts such as:

- HSK
- vocabulary
- lessons
- quizzes
- flashcards

Those will belong to the eventual application built on top of this starter.

---

# 2. Installing Angular CLI

Angular CLI is the command-line tool used to create and manage Angular projects.

Install it globally with npm:

```bash
npm install -g @angular/cli
```

Check the installation:

```bash
ng version
```

The `ng` command is the Angular CLI command.

Examples:

```bash
ng new frontend
ng serve
ng generate component
```

---

# 3. Creating the Angular Project

From the folder where the project should live:

```bash
ng new frontend
```

Angular asks several setup questions.

For this project we are using:

- Standalone Angular components
- Angular routing
- CSS
- No Ionic

After creation:

```bash
cd frontend
```

Start the development server:

```bash
ng serve
```

The application is normally available at:

```text
http://localhost:4200
```

---

# 4. Basic Angular Mental Model

A simple way to understand Angular is:

```text
Browser
   |
   v
Component
   |
   +---- HTML template
   |
   +---- TypeScript logic
   |
   +---- CSS styling
   |
   v
Services
   |
   v
HTTP API
   |
   v
Django backend
```

Angular is responsible for the browser application.

Django is responsible for the backend API and server-side security.

---

# 5. Current Application Folder Structure

Current important structure:

```text
src/
├── index.html
├── main.ts
├── styles.css
│
└── app/
    ├── app.config.ts
    ├── app.css
    ├── app.html
    ├── app.routes.ts
    ├── app.spec.ts
    ├── app.ts
    │
    ├── core/
    │   ├── auth/
    │   │   ├── models/
    │   │   │   └── auth.models.ts
    │   │   │
    │   │   └── services/
    │   │       ├── auth.service.ts
    │   │       ├── auth-state.service.ts
    │   │       └── csrf.service.ts
    │   │
    │   ├── config/
    │   │   └── api.config.ts
    │   │
    │   ├── errors/
    │   │   ├── api-error.models.ts
    │   │   ├── api-error.service.ts
    │   │   └── app-error-handler.ts
    │   │
    │   ├── guards/
    │   │   └── auth-guard.ts
    │   │
    │   ├── initialization/
    │   │   └── app.initializer.ts
    │   │
    │   └── interceptors/
    │       └── auth.interceptor.ts
    │
    └── pages/
        ├── landing/
        │   ├── landing.ts
        │   ├── landing.html
        │   └── landing.css
        │
        ├── auth/
        │   ├── login/
        │   │   ├── login.ts
        │   │   ├── login.html
        │   │   └── login.css
        │   │
        │   └── register/
        │       ├── register.ts
        │       ├── register.html
        │       └── register.css
        │
        ├── guest/
        │   ├── guest.ts
        │   ├── guest.html
        │   └── guest.css
        │
        ├── auth-test/
        │   ├── auth-test.ts
        │   ├── auth-test.html
        │   └── auth-test.css
        │
        └── app/
            ├── app.ts
            ├── app.html
            └── app.css
```

Some generated files may change as the starter develops. The important architectural idea is that:

```text
core/  = reusable application infrastructure

pages/ = screens/pages that the user visits
```

---

# 6. Files at `src/`

## `index.html`

The main HTML document loaded by the browser.

Angular eventually inserts the application into the root element.

Think:

```text
index.html
    ↓
Angular application
```

You normally do not put application page content here.

---

## `main.ts`

This is the Angular application's entry point.

Current structure:

```ts
import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';

import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
```

Its main job is to bootstrap/start Angular.

Think:

```text
main.ts
   ↓
bootstrap Angular
   ↓
App
```

---

## `styles.css`

Global CSS for the entire Angular application.

Use this for styles that should be available throughout the application.

Examples:

- global typography
- CSS reset
- reusable global rules

Page-specific styling belongs with the page.

---

# 7. Files at `src/app/`

## `app.ts`

The root Angular component.

It is the top-level component of the application.

It is not the same thing as the protected `/app` page.

This distinction is important:

```text
app.ts
    = Angular root component

pages/app/app.ts
    = application's protected page
```

---

## `app.html`

Template for the root Angular component.

The root component provides the shell in which routed pages are displayed.

---

## `app.css`

CSS for the root Angular component.

---

## `app.routes.ts`

Defines application routes.

Current routes include:

```text
/              → Landing
/login         → Login
/register      → Register
/guest         → Guest
/auth-test     → AuthTest
/app           → protected App page
```

The protected page uses:

```ts
canActivate: [authGuard]
```

This means Angular checks authentication before allowing navigation to `/app`.

Important:

> A route guard is a frontend UX/security boundary, but Django remains the real authority for authorization.

---

## `app.config.ts`

Application-level Angular configuration.

Current responsibilities include:

- browser global error listeners
- global `ErrorHandler`
- router
- HTTP client
- HTTP interceptor
- application initializer

Important providers currently include:

```ts
provideRouter(routes)
```

and:

```ts
provideHttpClient(
  withInterceptors([
    authInterceptor,
  ]),
)
```

and:

```ts
provideAppInitializer(initializeApp)
```

Think of `app.config.ts` as:

> "How should the Angular application be assembled?"

---

## `app.spec.ts`

Automated test file for the root application component.

As the starter grows, tests will be added for important reusable infrastructure.

---

# 8. The `core/` Folder

`core/` contains reusable infrastructure.

This is one of the most important architectural rules of the starter.

Do not put application-specific concepts here.

Good examples:

```text
authentication
CSRF
HTTP
routing guards
API errors
configuration
initialization
```

Bad examples for this starter:

```text
HSK
Vocabulary
Quiz
Flashcard
Lesson
```

Those belong to the future application.

---

# 9. `core/auth/`

Everything related to authentication infrastructure.

```text
auth/
├── models/
└── services/
```

---

# 10. `core/auth/models/auth.models.ts`

Contains TypeScript interfaces describing authentication-related data.

Examples:

```ts
User
LoginRequest
RegisterRequest
ChangePasswordRequest
CsrfResponse
ApiMessageResponse
```

Interfaces describe the **shape of data**.

For example:

```ts
export interface LoginRequest {
  username: string;
  password: string;
}
```

This tells TypeScript:

> A login request must contain a username and password.

Models do not normally perform the actual HTTP request.

---

# 11. `core/auth/services/auth.service.ts`

Responsible for authentication-related API requests.

Examples:

```text
login()
register()
logout()
refresh()
getCurrentUser()
```

It uses Angular's `HttpClient`.

Conceptually:

```text
Login page
    ↓
AuthService.login()
    ↓
HttpClient
    ↓
Django /api/auth/login/
```

The service keeps HTTP details out of the page component.

---

# 12. `core/auth/services/auth-state.service.ts`

Stores the application's current authentication state.

It answers questions such as:

```text
Who is currently logged in?
Is the user authenticated?
```

It uses a reactive state mechanism.

Current state includes:

```text
currentUser
isAuthenticated
```

The `/api/auth/me/` endpoint is used to determine whether the user is authenticated.

Important:

> The frontend does not decide whether the JWT is valid. Django does.

Angular only keeps a convenient representation of the current authentication state.

---

# 13. `core/auth/services/csrf.service.ts`

Handles CSRF initialization.

The application calls:

```text
GET /api/auth/csrf/
```

during startup.

The service stores the CSRF token in memory so the HTTP interceptor can use it for state-changing requests.

This supports the backend's CSRF protection while keeping JWTs in HttpOnly cookies.

---

# 14. `core/config/api.config.ts`

Stores API configuration.

For example:

```text
http://localhost:8000
```

Instead of scattering the backend URL throughout the application, services use the centralized configuration.

Think:

```text
api.config.ts
      ↓
AuthService
CsrfService
other API services
```

---

# 15. `core/errors/`

Contains error-handling infrastructure.

Current files:

```text
errors/
├── api-error.models.ts
├── api-error.service.ts
└── app-error-handler.ts
```

There are two different kinds of errors to understand:

```text
Application/runtime errors
        ↓
AppErrorHandler

HTTP/API errors
        ↓
ApiErrorService
```

They have different responsibilities.

---

# 16. `core/errors/api-error.models.ts`

Defines the normalized API error shape.

Current model:

```ts
export interface ApiError {
  status: number;
  message: string | null;
  fieldErrors: Record<string, string[]>;
}
```

This gives the rest of the Angular application one predictable error format.

Instead of every page understanding every possible Django response shape, we normalize it first.

---

# 17. `core/errors/api-error.service.ts`

Converts raw Angular `HttpErrorResponse` objects into our application's `ApiError`.

Example backend response:

```json
{
  "non_field_errors": [
    "Invalid username or password."
  ]
}
```

becomes approximately:

```ts
{
  status: 400,
  message: 'Invalid username or password.',
  fieldErrors: {}
}
```

Another backend response:

```json
{
  "username": [
    "A user with that username already exists."
  ],
  "email": [
    "A user with this email already exists."
  ]
}
```

becomes field-specific errors.

Important architecture:

```text
API error
    ↓
ApiErrorService
    ↓
normalized ApiError
    ↓
page decides how to display it
```

The service normalizes errors.

It does not control the UI.

---

# 18. `core/errors/app-error-handler.ts`

Angular's global application error handler.

Current idea:

```ts
@Injectable()
export class AppErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    console.error('Application error:', error);
  }
}
```

This is for unexpected Angular/application runtime errors.

It should **not** replace normal HTTP error handling.

For example:

```text
HTTP 400 login error
    → ApiErrorService

Unexpected Angular runtime error
    → AppErrorHandler
```

---

# 19. `core/guards/auth-guard.ts`

Protects frontend routes.

Current protected route:

```text
/app
```

The guard checks the authentication state.

If authenticated:

```text
/app → allowed
```

If not authenticated:

```text
/app → /login
```

Again:

> The guard improves the frontend experience. Django must still protect the actual API.

---

# 20. `core/initialization/app.initializer.ts`

Runs important startup initialization.

Current sequence:

```text
Angular starts
    ↓
Initialize CSRF
    ↓
Check current authentication
    ↓
Application is ready
```

The CSRF initialization happens before the authentication state initialization.

This means the application starts with the security-related infrastructure it needs.

---

# 21. `core/interceptors/auth.interceptor.ts`

The HTTP interceptor is one of the most important security files.

Its responsibilities currently include:

### 1. Send cookies

Requests use:

```ts
withCredentials: true
```

This allows the browser to send the HttpOnly JWT cookies to Django.

### 2. Send CSRF token

For:

```text
POST
PUT
PATCH
DELETE
```

the interceptor adds:

```text
X-CSRFToken
```

when a CSRF token is available.

### 3. Handle expired access tokens

If a protected API request returns:

```text
401
```

the interceptor can call:

```text
POST /api/auth/refresh/
```

and retry the original request.

### 4. Prevent refresh races

Multiple simultaneous 401 responses share one refresh request.

Conceptually:

```text
Request A → 401 ┐
Request B → 401 ├──→ one refresh request
Request C → 401 ┘
                     ↓
                  new token
                     ↓
             retry A/B/C
```

This was tested successfully.

Important exclusions include:

```text
/login/
/register/
/logout/
/refresh/
/csrf/
/me/
```

The interceptor should not recursively refresh those endpoints.

---

# 22. `pages/`

The `pages/` folder contains actual user-facing application screens.

Think:

```text
core/
    reusable infrastructure

pages/
    screens the user sees
```

---

# 23. `pages/landing/`

The public landing page.

Files:

```text
landing.ts
landing.html
landing.css
```

### `landing.ts`

Component logic.

### `landing.html`

What the user sees.

### `landing.css`

Styles specific to the landing page.

Route:

```text
/
```

---

# 24. `pages/auth/`

Contains authentication pages.

```text
auth/
├── login/
└── register/
```

Authentication infrastructure lives in:

```text
core/auth/
```

Authentication pages live in:

```text
pages/auth/
```

This separation is intentional.

---

# 25. `pages/auth/login/`

Files:

```text
login.ts
login.html
login.css
```

## `login.ts`

Controls login behavior.

It:

1. validates the form
2. calls `AuthService.login()`
3. handles API errors
4. retrieves the current user
5. updates `AuthStateService`
6. navigates to `/app`

---

# 26. The Login Form

The form uses Angular Reactive Forms.

Current controls:

```ts
username
password
```

Example:

```ts
protected readonly loginForm = this.fb.nonNullable.group({
  username: ['', [Validators.required]],
  password: ['', [Validators.required]],
});
```

Reactive forms allow Angular to track:

```text
value
validity
touched state
errors
```

---

# 27. Why We Changed Login UI State to Signals

This was an important Angular learning step.

Initially we used normal class properties:

```ts
protected isSubmitting = false;
protected errorMessage = '';
```

For example:

```ts
this.errorMessage = 'Invalid username or password.';
```

The HTTP error callback ran immediately, but the Login page did not immediately render the changed `errorMessage` in our Angular 21 setup.

We tested it carefully.

A synchronous test:

```ts
this.errorMessage = 'Test login error';
```

updated immediately.

The HTTP callback changed the property immediately, but the rendered page waited for another interaction.

Using:

```ts
ChangeDetectorRef.detectChanges()
```

forced the view to update and proved the issue was related to view scheduling.

However, we did **not** want to solve the reusable starter by manually calling `detectChanges()` everywhere.

Instead, we changed UI state to Angular signals.

---

# 28. Angular Signals

A signal is reactive state that Angular can track.

We changed:

```ts
protected isSubmitting = false;
protected errorMessage = '';
```

to:

```ts
protected readonly isSubmitting = signal(false);
protected readonly errorMessage = signal('');
```

Import:

```ts
import { Component, inject, signal } from '@angular/core';
```

Now we update the state with:

```ts
this.isSubmitting.set(true);
```

and:

```ts
this.isSubmitting.set(false);
```

For the error:

```ts
this.errorMessage.set(
  'Invalid username or password.',
);
```

---

# 29. Reading Signals in HTML

Normal property:

```html
{{ errorMessage }}
```

Signal:

```html
{{ errorMessage() }}
```

Normal conditional:

```html
@if (errorMessage) {
```

Signal:

```html
@if (errorMessage()) {
```

Normal boolean:

```html
[disabled]="isSubmitting"
```

Signal:

```html
[disabled]="isSubmitting()"
```

Think:

```text
signal()
   ↓
read current value
```

and:

```text
signal.set(...)
   ↓
update value
```

---

# 30. Current Login Signal Flow

Current login state flow:

```text
User clicks Sign In
        ↓
submit()
        ↓
Validate form
        ↓
isSubmitting.set(true)
        ↓
AuthService.login()
        ↓
Django API
        ↓
Success or error
```

On error:

```text
HTTP 400
    ↓
ApiErrorService.normalize()
    ↓
errorMessage.set(...)
    ↓
Angular knows the signal changed
    ↓
Login alert updates
```

On success:

```text
HTTP 200
    ↓
getCurrentUser()
    ↓
AuthStateService.setUser()
    ↓
navigate('/app')
```

---

# 31. `login.html`

The Login template displays:

- page heading
- error alert
- username field
- password field
- validation messages
- submit button
- navigation links

The important signal usage is:

```html
@if (errorMessage()) {
  <div class="error-message" role="alert">
    {{ errorMessage() }}
  </div>
}
```

and:

```html
<button
  type="submit"
  [disabled]="isSubmitting()"
>
  {{ isSubmitting() ? 'Signing in...' : 'Sign In' }}
</button>
```

---

# 32. `login.css`

Contains styles specific to the login page.

It should not contain backend logic or authentication logic.

---

# 33. `pages/auth/register/`

Files:

```text
register.ts
register.html
register.css
```

Registration currently contains:

```text
username
email
password
password confirmation
```

Email is required because the Django User model requires a unique email.

---

# 34. Register Error Handling

Registration demonstrates field-specific API errors.

For example Django can return:

```json
{
  "username": [
    "A user with that username already exists."
  ],
  "email": [
    "A user with this email already exists."
  ]
}
```

The Register component sends the response through:

```text
ApiErrorService
```

and then applies the errors to Angular form controls.

Conceptually:

```text
Django
   ↓
HTTP 400
   ↓
ApiErrorService
   ↓
fieldErrors
   ↓
username control
email control
   ↓
HTML displays messages beside fields
```

---

# 35. `register.ts`

The Register component is responsible for:

- reactive form validation
- password confirmation
- calling registration API
- applying server field errors
- displaying form-level errors
- navigating to login after success

It also has helper methods:

```text
applyFieldErrors()
clearServerErrors()
```

These keep the main `submit()` method easier to understand.

---

# 36. `register.html`

Displays:

- username validation
- email validation
- password validation
- password confirmation validation
- server-side field errors
- form-level errors

This demonstrates an important rule:

> Client-side validation improves UX, but Django remains the final authority.

---

# 37. `pages/guest/`

The Guest page is currently a foundation for future guest functionality.

Files:

```text
guest.ts
guest.html
guest.css
```

The starter should keep guest mode generic.

The eventual application can build application-specific guest sessions on top of this foundation.

---

# 38. `pages/auth-test/`

Temporary developer diagnostic page.

Files:

```text
auth-test.ts
auth-test.html
auth-test.css
```

This page was used to test authentication behavior without requiring the protected `/app` page.

It helped test:

- authenticated requests
- unauthenticated requests
- refresh
- protected endpoints
- concurrent requests

This is temporary infrastructure.

It should eventually be removed from the production starter once authentication testing is complete.

---

# 39. `pages/app/`

The protected application page.

Files:

```text
app.ts
app.html
app.css
```

Route:

```text
/app
```

It is protected by:

```ts
canActivate: [authGuard]
```

This page represents where the actual application will eventually live.

For the future Mandarin application, this is where application-specific features will eventually be built.

---

# 40. Authentication Architecture

The complete authentication architecture currently looks like this:

```text
                         Angular
                           |
                           v
                    Login/Register
                           |
                           v
                      AuthService
                           |
                           v
                    HttpInterceptor
                           |
                           v
                    Django REST API
                           |
                           v
                  JWT HttpOnly Cookies
```

JWT tokens are intentionally **not stored in**:

```text
localStorage
sessionStorage
```

The browser stores the JWT cookies as HttpOnly cookies.

JavaScript therefore does not directly read the JWT.

---

# 41. CSRF Architecture

Because authentication uses cookies, CSRF protection is important.

Startup:

```text
Angular starts
    ↓
CsrfService.initialize()
    ↓
GET /api/auth/csrf/
    ↓
Django provides CSRF token
    ↓
Angular keeps token in memory
```

For state-changing requests:

```text
POST / PUT / PATCH / DELETE
        ↓
AuthInterceptor
        ↓
X-CSRFToken header
        ↓
Django CSRF validation
```

---

# 42. Automatic Refresh Architecture

Access tokens are short-lived.

When an access token expires:

```text
Protected request
      ↓
401
      ↓
AuthInterceptor
      ↓
POST /api/auth/refresh/
      ↓
Django validates refresh token
      ↓
new access token
      ↓
retry original request
```

Multiple simultaneous requests use a single refresh request.

Example:

```text
A → 401
B → 401
C → 401
      ↓
   ONE refresh
      ↓
 A retry
 B retry
 C retry
```

This prevents refresh-request races.

---

# 43. Important Separation of Responsibilities

Remember these boundaries.

## Component

Responsible for:

```text
UI
form interaction
user-facing messages
navigation
```

## Service

Responsible for:

```text
API requests
reusable business/infrastructure operations
```

## Interceptor

Responsible for:

```text
cross-cutting HTTP behavior
cookies
CSRF header
401 refresh/retry
```

## Error Service

Responsible for:

```text
normalizing API errors
```

## Error Handler

Responsible for:

```text
unexpected Angular/runtime errors
```

## Guard

Responsible for:

```text
frontend route access
```

## Django

Responsible for:

```text
authentication authority
authorization
validation
JWT validation
CSRF validation
security
```

---

# 44. Useful Angular Commands

Create a component:

```bash
ng generate component pages/example
```

Short version:

```bash
ng g c pages/example
```

Create a service:

```bash
ng generate service core/example
```

Short version:

```bash
ng g s core/example
```

Start development server:

```bash
ng serve
```

Build:

```bash
ng build
```

Run tests:

```bash
ng test
```

Check Angular version:

```bash
ng version
```

---

# 45. Useful npm Commands

Install dependencies:

```bash
npm install
```

Install a package:

```bash
npm install package-name
```

Install a development dependency:

```bash
npm install --save-dev package-name
```

Update packages:

```bash
npm update
```

Run the development script:

```bash
npm start
```

The exact scripts are defined in:

```text
package.json
```

---

# 46. How to Think About the Project

When adding something new, ask:

### Is it reusable infrastructure?

Put it under:

```text
core/
```

Examples:

```text
auth
HTTP
errors
guards
configuration
```

### Is it a user-facing screen?

Put it under:

```text
pages/
```

Examples:

```text
login
register
landing
dashboard
```

### Is it application-specific?

Do not put it into the generic starter's core.

For example, eventually:

```text
features/
    vocabulary/
    lessons/
    quizzes/
```

can belong to the actual Mandarin application rather than the generic starter.

---

# 47. Current Learning Progress

We have completed the major authentication foundation:

```text
Angular project creation       ✅
Routing                         ✅
Login page                      ✅
Register page                   ✅
Reactive forms                  ✅
AuthService                     ✅
CSRF service                    ✅
HTTP interceptor                ✅
JWT cookie authentication       ✅
Auth state                      ✅
Auth guard                      ✅
Application initializer         ✅
Automatic token refresh         ✅
Concurrent refresh protection   ✅
Global error handler            ✅
API error normalization         ✅
Field-level registration errors ✅
Login signal-based UI state     ✅
```

---

# 48. What We Should Learn Next

The current roadmap is:

```text
1. Authentication
        ✅

2. Global/API error handling
        ✅

3. Loading/request state
        ← next

4. Reusable UI/layout

5. Guest-mode foundation

6. Application pages

7. Final security hardening

8. Starter cleanup/documentation
```

The next major concept is **loading/request state**.

We should learn how to consistently represent states such as:

```text
idle
loading
success
error
```

without duplicating messy logic throughout every page.

---

# 49. Beginner Cheat Sheet

When you forget what something does:

```text
main.ts
    → starts Angular

app.config.ts
    → configures Angular

app.routes.ts
    → defines URLs/pages

core/
    → reusable infrastructure

pages/
    → user-facing pages

service
    → reusable logic/API communication

model/interface
    → describes data shape

guard
    → protects frontend routes

interceptor
    → modifies/handles HTTP requests globally

initializer
    → runs setup when Angular starts

ErrorHandler
    → unexpected application/runtime errors

ApiErrorService
    → normalizes backend HTTP errors

signal()
    → reactive UI state

signal.set(...)
    → change signal state

signal()
in HTML
    → read signal value
```

---

# 50. The Most Important Mental Model

When learning Angular, don't try to memorize every file.

Remember the flow:

```text
USER
 ↓
PAGE / COMPONENT
 ↓
SERVICE
 ↓
HTTP CLIENT
 ↓
INTERCEPTOR
 ↓
DJANGO API
 ↓
RESPONSE
 ↓
SERVICE / ERROR HANDLING
 ↓
COMPONENT STATE
 ↓
TEMPLATE
 ↓
USER
```

For authentication:

```text
User
 ↓
Login component
 ↓
AuthService
 ↓
authInterceptor
 ↓
Django
 ↓
HttpOnly JWT cookie
 ↓
AuthStateService
 ↓
protected application
```

For an API error:

```text
Django
 ↓
HTTP error
 ↓
authInterceptor
 ↓
ApiErrorService
 ↓
component
 ↓
signal / form state
 ↓
HTML error message
```

Understanding these flows is more important than memorizing individual lines of code.

---

# 51. Final Reminder

This project is a **learning starter**, so it is intentionally structured to make responsibilities visible.

When something breaks, trace the flow instead of immediately adding a workaround:

```text
Where did the request start?
        ↓
Which service handled it?
        ↓
Did the interceptor change it?
        ↓
What did Django return?
        ↓
How was the response normalized?
        ↓
What component state changed?
        ↓
How does the template read that state?
```

That debugging habit will become much more valuable than memorizing Angular syntax.

---

# 52. Login RxJS Refactor — Finalized

The Login component was refactored to remove nested subscriptions and use a single RxJS pipeline. This change has been tested successfully and committed to Git.

The flow is now:

```text
submit()
   ↓
AuthService.login()
   ↓
switchMap()
   ↓
AuthService.getCurrentUser()
   ↓
AuthStateService.setUser()
   ↓
navigate('/app')
```

The important lesson is that `switchMap()` lets related asynchronous operations be expressed as one readable observable chain instead of putting one `subscribe()` inside another.

### Why this matters

Nested subscriptions can become difficult to maintain:

```ts
login().subscribe(() => {
  getCurrentUser().subscribe(...);
});
```

The refactored approach keeps the workflow together:

```ts
login()
  .pipe(
    switchMap(() => getCurrentUser()),
  )
  .subscribe(...);
```

This gives the Login component one final success path and one final error path.

### Error handling

`catchError()` is used at the `/me/` stage when a specific failure needs to be handled there, while `throwError()` allows the error to continue to the final subscription.

Remember:

```text
switchMap  → connect asynchronous operations
catchError → handle an error in the pipeline
throwError → continue as an error
subscribe  → consume the final result
```

### Signals remain responsible for simple UI state

Login now uses signals for state such as:

```ts
protected readonly isSubmitting = signal(false);
protected readonly errorMessage = signal('');
```

Reactive Forms still handle form state and validation. Signals handle simple component UI state.

```text
Reactive Forms → form values + validation
Signals        → component UI state
```

### Git checkpoint

The refactor has been committed with:

```text
refactor: simplify login observable flow
```

This is now a clean checkpoint before moving to the next architecture topic.

---

# 53. Current Learning Checkpoint

The starter has now completed:

```text
Authentication foundation       ✅
Global/API error handling       ✅
Signals for UI state            ✅
Login RxJS refactor             ✅

Reusable loading/request state  ← NEXT
```

The next step is **not** simply adding another `isLoading` variable to every component.

We will first learn how to model request state consistently, such as:

```text
idle
  ↓
loading
  ↓
success
```

or:

```text
idle
  ↓
loading
  ↓
error
```

The goal is a reusable pattern that can later be used by Login, Register, profile requests, application pages, guest flows, and other API-driven features without duplicating request-state logic everywhere.

The important learning question before writing code is:

> **Where should request state live, what states do we actually need, and how can components consume it consistently?**

That will be the next architectural checkpoint.



---

# 54. Reusable Request State

We started learning how to represent the state of an API request consistently instead of creating a separate collection of loading/data/error variables for every page.

The goal is to distinguish **application state** from **request state**:

```text
AuthStateService
    → currentUser
    → isAuthenticated

RequestState
    → what is happening with this API operation?
```

A request can move through these states:

```text
idle
  ↓
loading
  ↓
success
```

or:

```text
idle
  ↓
loading
  ↓
error
```

## `request-state.ts`

We created:

```text
src/app/core/state/request-state.ts
```

The model uses a **discriminated union**:

```ts
export interface IdleRequestState {
  status: 'idle';
}

export interface LoadingRequestState {
  status: 'loading';
}

export interface SuccessRequestState<T> {
  status: 'success';
  data: T;
}

export interface ErrorRequestState {
  status: 'error';
  error: ApiError;
}

export type RequestState<T> =
  | IdleRequestState
  | LoadingRequestState
  | SuccessRequestState<T>
  | ErrorRequestState;
```

### What the `status` does

`status` is the **discriminator**. It tells TypeScript which member of the union we currently have.

For example:

```ts
if (state.status === 'success') {
  state.data;
}
```

TypeScript understands that `data` exists because the state has been narrowed to `SuccessRequestState<T>`.

Likewise:

```ts
if (state.status === 'error') {
  state.error;
}
```

The error property is available because the state has been narrowed to `ErrorRequestState`.

This is safer than creating one object with many optional properties, because the union prevents invalid combinations such as a loading state containing unrelated success data.

## What does `<T>` mean?

`T` is a TypeScript **generic**. It represents whatever data type a successful request returns.

For example:

```ts
RequestState<User>
RequestState<string>
RequestState<Lesson>
```

The same reusable state model can therefore be used for many different API operations.

## `request-state.utils.ts`

We then created:

```text
src/app/core/state/request-state.utils.ts
```

The helper converts:

```text
Observable<T>
     ↓
toRequestState()
     ↓
Observable<RequestState<T>>
```

Its job is to convert the normal RxJS request result into our standardized state:

```text
startWith()
    ↓
loading

map()
    ↓
success + data

catchError()
    ↓
ApiError
    ↓
error + error
```

The helper does not create the initial `idle` state. The component starts with `idle`, then the active request emits `loading` followed by either `success` or `error`.

## Why we do not inject `ApiErrorService` inside the utility

Our first version used:

```ts
inject(ApiErrorService)
```

inside `toRequestState()`.

When the temporary test component called the function from a button click, Angular produced:

```text
NG0203: inject() function must be called from an injection context
```

This taught us an important Angular concept: a normal event-handler function is not automatically an Angular injection context.

We changed the design so the component injects `ApiErrorService` and passes it to the utility:

```ts
private readonly apiErrorService =
  inject(ApiErrorService);

// ...

toRequestState(
  request$,
  this.apiErrorService,
);
```

This keeps the utility itself independent of Angular dependency injection and makes its dependencies explicit.

## Temporary Request State Test

To learn the new abstraction safely, we created a temporary page similar to the existing authentication test page:

```text
src/app/pages/request-state-test/
├── request-state-test.ts
├── request-state-test.html
└── request-state-test.css
```

Temporary route:

```text
/request-state-test
```

The page used fake RxJS Observables rather than the Django API so that we could test request-state behavior without changing the working authentication system.

### Success test

The success test used a one-second delay so the loading state could be observed:

```text
idle
  ↓
loading
  ↓
success + data
```

The browser console confirmed:

```text
{ status: 'loading' }
{ status: 'success', data: 'Test request succeeded!' }
```

### Error test

We first used a normal JavaScript `Error`, then changed the test to use Angular's actual `HttpErrorResponse` type.

The simulated error represented a server failure:

```text
HTTP 500
```

The final state was:

```text
{ status: 'error', error: ... }
```

The template displayed:

```text
Error: Something went wrong. Please try again.
```

This proved that `ApiErrorService` was also integrated correctly. The simulated server detail was not exposed directly to the user; the normalized safe message was displayed instead.

## Signals + RequestState

The temporary component stores the request state in a signal:

```ts
protected readonly requestState =
  signal<RequestState<string>>({
    status: 'idle',
  });
```

The Observable updates the signal:

```ts
toRequestState(
  request$,
  this.apiErrorService,
).subscribe((state) => {
  this.requestState.set(state);
});
```

The template can then react to the current state.

The overall flow is:

```text
Observable<T>
      ↓
toRequestState()
      ↓
RequestState<T>
      ↓
signal
      ↓
Angular template
```

## Important architectural lesson

We are **not** creating one giant global loading service.

We are also **not** putting request state inside `AuthService`.

The intended separation is:

```text
Service
  → communicates with the API

Component
  → owns the UI state for its request

RequestState<T>
  → provides a reusable, consistent state model

ApiErrorService
  → normalizes HTTP errors
```

This keeps the generic starter reusable and avoids coupling request UI state to authentication.

## Current checkpoint

```text
RequestState<T> model             ✅
Discriminated union                ✅
TypeScript generics                ✅
toRequestState() helper            ✅
ApiErrorService integration        ✅
Loading → success test             ✅
Loading → error test               ✅
HttpErrorResponse test             ✅
Signals integration                ✅
```

The temporary test page is intentionally kept until we finish the learning checkpoint and decide how to apply the pattern to a real page.

The next practical step is to test the pattern on one real application page, starting with Login, while deciding whether its existing simple `isSubmitting` signal should remain or be replaced by `RequestState`.

---

# 54. Reusable Request State — Learning Notes

We introduced a reusable request-state pattern so API-driven pages do not have to manage separate `isLoading`, `data`, and `error` variables everywhere.

## 54.1 The problem we are solving

A simple component might start with:

```ts
protected readonly isSubmitting = signal(false);
```

That works well for a small operation such as Login or Register. But as the application grows, we can end up with many slightly different variables:

```text
Login      → isSubmitting
Register   → isSubmitting
Profile    → isLoading
Dashboard  → isLoading
Other page → isLoading
```

The goal is not to eliminate every simple loading signal. The goal is to have a reusable model when a request has several meaningful states.

A request is more than just loading/not loading:

```text
idle
  ↓
loading
  ↓
success
```

or:

```text
idle
  ↓
loading
  ↓
error
```

## 54.2 Request state vs application state

This distinction is important.

`AuthStateService` stores application state such as:

```text
currentUser
isAuthenticated
```

Request state answers a different question:

```text
What is happening with this API operation right now?
```

We therefore keep them separate.

```text
Application state → AuthStateService
Request state     → RequestState<T>
```

## 54.3 The RequestState<T> model

We created:

```text
src/app/core/state/request-state.ts
```

The model is a discriminated union:

```ts
export interface IdleRequestState {
  status: 'idle';
}

export interface LoadingRequestState {
  status: 'loading';
}

export interface SuccessRequestState<T> {
  status: 'success';
  data: T;
}

export interface ErrorRequestState {
  status: 'error';
  error: ApiError;
}

export type RequestState<T> =
  | IdleRequestState
  | LoadingRequestState
  | SuccessRequestState<T>
  | ErrorRequestState;
```

### What does the `|` mean?

The `|` means **or**.

A `RequestState<T>` can be:

```text
idle
OR
loading
OR
success
OR
error
```

### What is `T`?

`T` is a TypeScript generic. It is a placeholder for the type of successful data.

For example:

```ts
RequestState<string>
RequestState<User>
RequestState<Lesson>
```

For our temporary test, we used:

```ts
RequestState<string>
```

so the success state contains a string:

```ts
{
  status: 'success',
  data: 'Test request succeeded!'
}
```

## 54.4 Why the `status` field is important

The `status` field is the **discriminator**.

For example:

```ts
if (state.status === 'success') {
  state.data;
}
```

TypeScript can narrow the union and understand that `data` exists.

Likewise:

```ts
if (state.status === 'error') {
  state.error;
}
```

This prevents invalid combinations. We do not want a model where every property is optional, because that could allow states such as:

```text
isLoading = false
data = null
error = null
```

The discriminated union gives us a clearer and safer state model.

## 54.5 Temporary Request State test page

Before changing a real page, we created a temporary test component similar to the existing `auth-test` page:

```text
src/app/pages/request-state-test/
├── request-state-test.ts
├── request-state-test.html
└── request-state-test.css
```

and temporarily added:

```text
/request-state-test
```

to the Angular routes.

The purpose was to test the request-state infrastructure without changing the working Django authentication flow.

## 54.6 The reusable `toRequestState()` helper

We created:

```text
src/app/core/state/request-state.utils.ts
```

The idea is:

```text
Observable<T>
     ↓
toRequestState()
     ↓
Observable<RequestState<T>>
```

The helper uses RxJS operators to convert normal request results into our standard state model.

Conceptually:

```text
request$
  │
  ├── startWith() → loading
  │
  ├── map()       → success + data
  │
  └── catchError()
          ↓
      ApiErrorService
          ↓
      error + ApiError
```

The helper starts with `loading`, converts successful values into a `success` state, and converts HTTP errors into an `error` state.

The helper does not emit the initial `idle` state. The component starts its signal with `idle`, and the request helper takes over with `loading` once the request begins.

## 54.7 Important Angular lesson: `inject()` and injection context

Our first version of `toRequestState()` tried to do this inside the utility:

```ts
const apiErrorService = inject(ApiErrorService);
```

When the temporary test called the helper from a button-click method, Angular produced:

```text
NG0203: The `ApiErrorService` token injection failed.
`inject()` function must be called from an injection context.
```

This was an important lesson. A normal button-click method is not automatically an Angular injection context.

We changed the design so the component injects `ApiErrorService` and passes it into the utility:

```ts
private readonly apiErrorService =
  inject(ApiErrorService);
```

then:

```ts
toRequestState(
  request$,
  this.apiErrorService,
)
```

This keeps the utility simpler and avoids making the RxJS utility depend directly on Angular's dependency-injection context.

The architecture is now:

```text
RequestStateTest component
        │
        │ inject()
        ↓
ApiErrorService
        │
        │ passed as an argument
        ↓
toRequestState()
```

## 54.8 First success/error tests

For the first experiment, we created fake Observables rather than making real API calls.

The success test used a delayed Observable:

```ts
const request$: Observable<string> = of(
  'Test request succeeded!',
).pipe(
  delay(1000),
);
```

The one-second delay was intentional. It gave us enough time to observe the `loading` state before the request became successful.

The error test initially used:

```ts
throwError(
  () => new Error('Test request failed.'),
)
```

The test proved that the helper produced an error state, but this was not yet the same type of error Angular produces for an HTTP request.

## 54.9 Using temporary console logging to observe state transitions

To make the state transitions visible, we temporarily added a console log inside the subscription:

```ts
toRequestState(
  request$,
  this.apiErrorService,
).subscribe((state) => {
  console.log('Request state:', state);

  this.requestState.set(state);
});
```

This let us see the actual sequence in the browser console.

For the success test we observed:

```text
Request state: {status: 'loading'}
Request state: {status: 'success', data: 'Test request succeeded!'}
```

For the error test we observed:

```text
Request state: {status: 'loading'}
Request state: {status: 'error', error: {...}}
```

This was useful for learning because the browser page only showed the final result after the request completed. The console showed that `loading` really was emitted first.

After confirming the behavior, we removed the temporary `console.log()` statements.

**Learning rule:** temporary console logging is useful when learning or debugging state transitions, but debugging logs should be removed when they are no longer needed. We also never log passwords, JWTs, CSRF tokens, or other sensitive authentication data.

## 54.10 Testing with a real `HttpErrorResponse` shape

Because our production helper expects an Angular `HttpErrorResponse`, we then changed the error test to simulate one:

```ts
throwError(
  () =>
    new HttpErrorResponse({
      status: 500,
      error: {
        detail: 'Test server error.',
      },
    }),
)
```

This more closely represents a real HTTP failure from the backend.

The error then followed this path:

```text
HttpErrorResponse (500)
        ↓
toRequestState()
        ↓
ApiErrorService.normalize()
        ↓
ApiError
        ↓
RequestState.error
        ↓
requestState signal
        ↓
Angular template
```

The UI displayed:

```text
Something went wrong. Please try again.
```

instead of exposing the simulated server detail. This confirmed that the existing `ApiErrorService` and request-state helper work together as intended.

## 54.11 Signals and RequestState

The temporary component stores the request state in a signal:

```ts
protected readonly requestState =
  signal<RequestState<string>>({
    status: 'idle',
  });
```

The subscription updates it:

```ts
this.requestState.set(state);
```

The template reads the signal and checks the discriminator:

```html
@if (requestState(); as state) {
  @if (state.status === 'loading') {
    ...
  }

  @if (state.status === 'success') {
    {{ state.data }}
  }

  @if (state.status === 'error') {
    {{ state.error.message }}
  }
}
```

Using `@if (requestState(); as state)` gives the template one local `state` value. This also lets Angular's template type checking narrow the discriminated union correctly before accessing `state.data` or `state.error`.

## 54.12 What we deliberately did not do

For this architecture we did **not**:

- create a global spinner for every HTTP request
- put loading state inside `AuthService`
- modify `auth.interceptor.ts`
- introduce a state-management library
- create a giant generic HTTP service
- replace every existing `isSubmitting` signal immediately
- add unnecessary RxJS complexity

The goal is a small reusable abstraction that components can use when it provides real value.

## 54.13 Current architecture

Our current reusable state folder is:

```text
src/app/core/state/
├── request-state.ts
└── request-state.utils.ts
```

The responsibilities are:

```text
request-state.ts
    → defines the state shapes

request-state.utils.ts
    → converts Observable results/errors into RequestState<T>

ApiErrorService
    → normalizes backend HTTP errors

signal()
    → stores reactive component UI state

component
    → decides how the UI should display each state
```

## 54.14 Learning checkpoint

We have now verified:

```text
RequestState<T> model              ✅
Discriminated union                ✅
TypeScript generic T               ✅
Temporary test component           ✅
toRequestState() helper            ✅
Angular injection-context lesson   ✅
Loading state                      ✅
Success state + data               ✅
Error state + ApiError             ✅
Temporary console logging test     ✅
HttpErrorResponse test             ✅
Signals integration                ✅
```

The temporary test page is intentionally kept until we finish this learning checkpoint and decide how to apply the pattern to a real page.

The next practical step is to test the pattern on one real application page, starting with Login, while deciding whether its existing simple `isSubmitting` signal should remain or be replaced by `RequestState`.
