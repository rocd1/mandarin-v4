# Project App Starter — Angular Learning Notes

This README is both a **learning record** and an **architecture reference** for the Angular frontend of the Project App Starter.

The goal is not only to remember which commands were used, but to understand:

* why each folder exists
* what responsibility belongs in each layer
* how Angular communicates with Django
* how authentication is structured
* how reusable layouts and UI components are organized
* what belongs in the generic starter versus the eventual application

---

# 1. What We Are Building

This project is a reusable Angular frontend starter designed to work with our secure Django REST Framework backend.

The starter is intentionally generic.

It provides reusable infrastructure and design foundations without containing application-specific business concepts.

For example, this starter does **not** contain:

```text
HSK
Vocabulary
Lessons
Quizzes
Flashcards
Chinese characters
```

Those belong to the eventual application built using this starter.

The relationship is:

```text
Project App Starter
        │
        ├── Django secure backend
        │
        └── Angular secure frontend
                │
                ↓
        Future applications
```

---

# 2. Current Stack

Current frontend environment:

```text
Angular CLI: 21.2.22
Angular:     21.2.22
TypeScript:  5.9.3
RxJS:        7.8.2

Frontend:
http://localhost:4200

Django API:
http://localhost:8000
```

The project uses:

* standalone Angular components
* Angular routing
* Reactive Forms
* Angular Signals
* RxJS
* HttpOnly JWT cookies
* CSRF protection
* route guards
* HTTP interceptors
* centralized API error normalization
* reusable request-state modeling
* reusable layout/design components
* CSS

No Ionic is used.

---

# 3. Creating the Angular Project

Angular CLI is the command-line tool used to create and manage Angular projects.

Install it globally:

```bash
npm install -g @angular/cli
```

Check the installation:

```bash
ng version
```

Create a project:

```bash
ng new frontend
```

For this starter we use:

```text
Standalone components
Angular routing
CSS
No Ionic
```

Start the development server:

```bash
ng serve
```

The frontend is normally available at:

```text
http://localhost:4200
```

---

# 4. Basic Angular Mental Model

A simple way to understand the application is:

```text
Browser
   │
   ↓
Angular Components
   │
   ├── HTML templates
   ├── TypeScript logic
   └── CSS
   │
   ↓
Services / State / HTTP
   │
   ↓
Django REST API
```

Angular owns the browser application.

Django owns the backend API and remains the authority for:

```text
Authentication
Authorization
Validation
JWT validation
CSRF validation
Security
```

---

# 5. Final Project Architecture

The current frontend architecture is:

```text
src/
│
├── index.html
├── main.ts
├── styles.css
│
└── app/
    │
    ├── app.ts
    ├── app.html
    ├── app.css
    ├── app.config.ts
    ├── app.routes.ts
    ├── app.spec.ts
    │
    ├── core/
    │   │
    │   ├── auth/
    │   │   ├── models/
    │   │   │   └── auth.models.ts
    │   │   │
    │   │   └── services/
    │   │       ├── auth.service.ts
    │   │       ├── auth-state.ts
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
    │   ├── interceptors/
    │   │   └── auth.interceptor.ts
    │   │
    │   └── state/
    │       ├── request-state.ts
    │       └── request-state.utils.ts
    │
    ├── layouts/
    │   │
    │   ├── public-layout/
    │   │   ├── public-layout.ts
    │   │   ├── public-layout.html
    │   │   └── public-layout.css
    │   │
    │   ├── app-layout/
    │   │   ├── app-layout.ts
    │   │   ├── app-layout.html
    │   │   └── app-layout.css
    │   │
    │   └── designs/
    │       │
    │       ├── public/
    │       │   ├── headers/
    │       │   │   └── minimal/
    │       │   │       └── minimal-header/
    │       │   │           ├── minimal-header.ts
    │       │   │           ├── minimal-header.html
    │       │   │           ├── minimal-header.css
    │       │   │           └── minimal-header.spec.ts
    │       │   │
    │       │   └── footers/
    │       │       └── simple/
    │       │           └── simple-footer/
    │       │               ├── simple-footer.ts
    │       │               ├── simple-footer.html
    │       │               ├── simple-footer.css
    │       │               └── simple-footer.spec.ts
    │       │
    │       └── app/
    │           ├── headers/
    │           │   └── app-bar/
    │           │       ├── app-bar.ts
    │           │       ├── app-bar.html
    │           │       ├── app-bar.css
    │           │       └── app-bar.spec.ts
    │           │
    │           └── navigation/
    │               └── bottom/
    │                   ├── bottom-navigation.ts
    │                   ├── bottom-navigation.html
    │                   ├── bottom-navigation.css
    │                   └── bottom-navigation.spec.ts
    │
    ├── pages/
    │   │
    │   ├── landing/
    │   │   ├── landing.ts
    │   │   ├── landing.html
    │   │   ├── landing.css
    │   │   └── landing.spec.ts
    │   │
    │   ├── auth/
    │   │   ├── login/
    │   │   │   ├── login.ts
    │   │   │   ├── login.html
    │   │   │   ├── login.css
    │   │   │   └── login.spec.ts
    │   │   │
    │   │   └── register/
    │   │       ├── register.ts
    │   │       ├── register.html
    │   │       ├── register.css
    │   │       └── register.spec.ts
    │   │
    │   ├── guest/
    │   │   ├── guest.ts
    │   │   ├── guest.html
    │   │   ├── guest.css
    │   │   └── guest.spec.ts
    │   │
    │   ├── app/
    │   │   ├── app.ts
    │   │   ├── app.html
    │   │   ├── app.css
    │   │   └── app.spec.ts
    │   │
    │   ├── auth-test/
    │   │   ├── auth-test.ts
    │   │   ├── auth-test.html
    │   │   └── auth-test.css
    │   │
    │   └── request-state-test/
    │       ├── request-state-test.ts
    │       ├── request-state-test.html
    │       └── request-state-test.css
    │
    └── shared/
        └── ui/
            └── button/
                ├── button.ts
                ├── button.html
                ├── button.css
                └── button.spec.ts
```

The most important architectural separation is:

```text
core/
    ↓
Reusable application infrastructure

layouts/
    ↓
Reusable page structure + design composition

pages/
    ↓
User-facing screens

shared/
    ↓
Small reusable UI primitives
```

---

# 6. The Three Main Layers

The application can be understood as three major layers.

## Core

```text
core/
```

Contains reusable infrastructure.

Examples:

```text
authentication
HTTP
CSRF
errors
guards
configuration
initialization
request state
```

Core should remain generic.

---

## Layouts

```text
layouts/
```

Contains reusable page structure.

Layouts decide which reusable visual components surround the routed page content.

For example:

```text
PublicLayout
    │
    ├── MinimalHeader
    ├── RouterOutlet
    └── SimpleFooter
```

and:

```text
AppLayout
    │
    ├── AppBar
    ├── RouterOutlet
    └── BottomNavigation
```

---

## Pages

```text
pages/
```

Contains screens the user actually visits.

Examples:

```text
Landing
Login
Register
Guest
App
```

Page components contain application-specific UI and behavior.

---

# 7. Design Library Architecture

The `layouts/designs/` directory is a reusable design library.

Its purpose is to provide independent visual building blocks.

The library is organized by:

```text
Public
    ├── Headers
    ├── Navigation
    └── Footers

App
    ├── Headers
    └── Navigation
```

Current library:

```text
designs/
├── public/
│   ├── headers/
│   │   └── minimal/
│   │       └── minimal-header/
│   │
│   └── footers/
│       └── simple/
│           └── simple-footer/
│
└── app/
    ├── headers/
    │   └── app-bar/
    │
    └── navigation/
        └── bottom/
```

Future alternatives can be added without changing the architectural concept:

```text
public/
├── headers/
│   ├── minimal/
│   ├── centered/
│   └── hamburger/
│
├── navigation/
│   └── bottom/
│
└── footers/
    ├── simple/
    └── columns/

app/
├── headers/
│   ├── simple/
│   ├── dashboard/
│   └── app-bar/
│
└── navigation/
    ├── sidebar/
    └── bottom/
```

The important principle is:

> Header, Navigation, and Footer are reusable, independently selectable library components.

They are not one giant configurable component.

---

# 8. Layouts Compose the Design Components

A layout is the composition layer.

For example:

```text
AppLayout
├── AppBar
├── RouterOutlet
└── BottomNavigation
```

The layout chooses which library components the application uses.

A different project could choose:

```text
AppLayout
├── DashboardHeader
├── RouterOutlet
└── SidebarNavigation
```

The library provides the choices.

The layout composes the choices.

The page provides the content.

This is preferable to creating a giant component such as:

```html
<app-layout
  header="minimal"
  navigation="bottom"
  footer="simple">
</app-layout>
```

The starter instead uses explicit composition.

---

# 9. `PublicLayout`

`PublicLayout` is the composition layer for public pages.

Current public routes include:

```text
/
 /login
 /register
 /guest
```

Current composition:

```text
PublicLayout
    │
    ├── MinimalHeader
    │
    ├── RouterOutlet
    │
    └── SimpleFooter
```

Its responsibility is to provide common public-page structure.

It should not contain page-specific business logic.

---

# 10. `AppLayout`

`AppLayout` is the composition layer for authenticated application pages.

Current composition:

```text
AppLayout
    │
    ├── AppBar
    │
    ├── optional menu
    │
    ├── RouterOutlet
    │
    └── BottomNavigation
```

The `/app` route is protected by:

```ts
canActivate: [authGuard]
```

The layout therefore provides the common structure for authenticated pages.

---

# 11. App Bar

Current component:

```text
layouts/designs/app/headers/app-bar/
```

The App Bar is independently reusable.

It currently provides:

```text
Menu button
Application title
Search button
```

It communicates with `AppLayout` through Angular inputs and outputs.

Conceptually:

```text
AppLayout
    │
    ├── sends menu state
    │
    ↓
AppBar
    │
    ├── menuToggle
    └── search
    │
    ↓
AppLayout
```

This keeps the App Bar responsible for its own UI while the layout controls the surrounding application behavior.

---

# 12. Bottom Navigation

Current component:

```text
layouts/designs/app/navigation/bottom/
```

It is an independent navigation component.

The current starter implementation provides placeholder application navigation.

The actual application can later replace or extend the navigation according to its own needs.

The important architectural point is:

```text
Navigation
    ≠
Layout
```

The navigation is a reusable design component.

The layout decides whether and where it is used.

---

# 13. Minimal Header

Current component:

```text
layouts/designs/public/headers/minimal/minimal-header/
```

The Minimal Header is an independently reusable public header.

It accepts a configurable brand value using an Angular input.

For example:

```text
Project App Starter
```

The component owns:

```text
header markup
header styling
brand link
```

The layout owns:

```text
where the header appears
what comes before/after it
```

---

# 14. Simple Footer

Current component:

```text
layouts/designs/public/footers/simple/simple-footer/
```

The Simple Footer is an independently reusable public footer.

It accepts configurable footer text.

Again:

```text
SimpleFooter
    ↓
owns footer UI

PublicLayout
    ↓
decides where footer appears
```

---

# 15. Shared UI

The `shared/` directory contains small reusable UI primitives.

Current component:

```text
shared/
└── ui/
    └── button/
```

The Button component provides common button behavior and styling.

Current API includes:

```text
type
variant
disabled
```

Supported variants currently include:

```text
primary
secondary
```

The component uses content projection so the consuming page supplies the button text/content.

Example:

```html
<app-button type="submit">
  Login
</app-button>
```

---

# 16. Why We Did Not Keep `FormField`

We experimented with a reusable:

```text
shared/ui/form-field/
```

component.

It was tested in the Login page before making a final architectural decision.

The experiment was useful because it taught us that repeated markup does not automatically justify a reusable component.

Problems included:

* limited code reduction
* fields remained highly context-dependent
* projected content introduced styling complexity
* the abstraction did not solve a significant recurring problem
* direct form markup remained easier to understand

The final decision was:

```text
FormField abstraction
        ↓
Not adopted
```

The component was removed.

The lesson is:

> Do not abstract repeated markup simply because it is repeated. Abstract it when the component provides a clear, reusable responsibility that makes the application simpler.

---

# 17. Authentication Architecture

Authentication uses JWTs stored in HttpOnly cookies.

The frontend does not store JWTs in:

```text
localStorage
sessionStorage
```

The architecture is:

```text
Angular
   │
   ↓
Login / Register
   │
   ↓
AuthService
   │
   ↓
HTTP Interceptor
   │
   ↓
Django REST API
   │
   ↓
HttpOnly JWT Cookies
```

The browser manages the JWT cookies.

JavaScript does not directly read the JWT.

---

# 18. `AuthService`

Location:

```text
core/auth/services/auth.service.ts
```

Responsible for authentication-related API communication.

Examples:

```text
login()
register()
logout()
refresh()
getCurrentUser()
```

Conceptually:

```text
Login component
      ↓
AuthService
      ↓
HttpClient
      ↓
Django API
```

The service keeps API communication out of page components.

---

# 19. `AuthState`

Location:

```text
core/auth/services/auth-state.ts
```

Responsible for the frontend representation of authentication state.

It answers questions such as:

```text
Who is currently logged in?
Is the user authenticated?
```

The server remains authoritative.

Angular does not independently determine whether a JWT is valid.

The `/api/auth/me/` endpoint is used to establish the authenticated user.

Conceptually:

```text
Django
   ↓
/api/auth/me/
   ↓
AuthState
   ↓
Angular UI
```

---

# 20. CSRF Architecture

Because authentication uses cookies, CSRF protection is required for state-changing requests.

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

JWTs remain HttpOnly.

The CSRF token is separate from the JWT.

---

# 21. HTTP Interceptor

Location:

```text
core/interceptors/auth.interceptor.ts
```

The interceptor handles cross-cutting HTTP authentication behavior.

Its responsibilities include:

### Cookies

Requests use:

```ts
withCredentials: true
```

This allows the browser to send the authentication cookies to Django.

### CSRF

For state-changing requests:

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

### Automatic access-token refresh

When an authenticated API request receives:

```text
401
```

the interceptor can request a new access token:

```text
Protected request
      ↓
401
      ↓
POST /api/auth/refresh/
      ↓
Django validates refresh token
      ↓
new access token
      ↓
retry original request
```

---

# 22. Concurrent Refresh Protection

Multiple requests can expire at approximately the same time.

For example:

```text
Request A → 401
Request B → 401
Request C → 401
```

The interceptor prevents these requests from independently starting multiple refresh operations.

Instead:

```text
A → 401 ┐
B → 401 ├──→ ONE refresh request
C → 401 ┘
             ↓
          new token
             ↓
        retry A/B/C
```

This prevents refresh races and unnecessary refresh requests.

This behavior was tested successfully against the Django backend.

---

# 23. Authentication Testing

The authentication foundation was tested with the Django API.

Successful authenticated cycle:

```text
POST /api/auth/login/   → 200
GET  /api/auth/me/      → 200
POST /api/auth/logout/  → 200
GET  /api/auth/me/      → 401
```

This confirms the expected basic lifecycle:

```text
login
  ↓
authenticated
  ↓
logout
  ↓
unauthenticated
```

Automatic refresh was also tested:

```text
GET /api/test/protected/ → 401
        ↓
POST /api/auth/refresh/  → 200
        ↓
retry protected request  → 200
```

---

# 24. Route Guards

Location:

```text
core/guards/auth-guard.ts
```

The authentication guard protects frontend routes.

Current protected route:

```text
/app
```

Conceptually:

```text
Navigate to /app
       ↓
authGuard
       ↓
Authenticated?
   ┌───┴───┐
  yes      no
   ↓        ↓
allow     /login
```

Important:

> The route guard protects frontend navigation. Django must still protect the actual API endpoints.

A user must never gain backend access simply by bypassing an Angular route guard.

---

# 25. Application Initialization

Location:

```text
core/initialization/app.initializer.ts
```

The application performs security-related initialization when Angular starts.

Current conceptual sequence:

```text
Angular starts
      ↓
Initialize CSRF
      ↓
Check current authentication
      ↓
Application becomes ready
```

This allows the application to establish its initial security and authentication state before normal application use.

---

# 26. Error Architecture

The starter distinguishes between two major error categories.

```text
Unexpected Angular/runtime error
            ↓
     AppErrorHandler

HTTP/API error
            ↓
     ApiErrorService
```

These responsibilities should not be mixed.

---

# 27. API Error Normalization

Location:

```text
core/errors/api-error.service.ts
```

The backend can return different error structures.

Instead of making every page understand every possible response shape, the service converts them into one predictable format.

Current model:

```ts
export interface ApiError {
  status: number;
  message: string | null;
  fieldErrors: Record<string, string[]>;
}
```

Conceptually:

```text
Django error
     ↓
ApiErrorService
     ↓
normalized ApiError
     ↓
page decides how to display it
```

The service normalizes the error.

The page controls the UI.

---

# 28. Field-Level Registration Errors

Registration demonstrates server-side field validation.

Django can return:

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

The Angular flow is:

```text
Django
   ↓
HTTP 400
   ↓
ApiErrorService
   ↓
fieldErrors
   ↓
Angular form controls
   ↓
validation messages
```

This is an important security principle:

> Client-side validation improves user experience, but the server remains authoritative.

---

# 29. Global Application Error Handler

Location:

```text
core/errors/app-error-handler.ts
```

This handles unexpected Angular/application runtime errors.

It should not replace normal API error handling.

For example:

```text
HTTP 400
    ↓
ApiErrorService

Unexpected Angular runtime failure
    ↓
AppErrorHandler
```

---

# 30. Request State

The starter now has a reusable model for API request state.

Location:

```text
core/state/
├── request-state.ts
└── request-state.utils.ts
```

A request can move through:

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

The model is a TypeScript discriminated union.

Conceptually:

```text
RequestState<T>
```

can represent:

```text
Idle
Loading
Success<T>
Error
```

The generic `<T>` allows the same model to represent different response types.

Examples:

```ts
RequestState<User>
RequestState<string>
RequestState<SomeData>
```

---

# 31. `toRequestState()`

Location:

```text
core/state/request-state.utils.ts
```

The utility converts:

```text
Observable<T>
      ↓
toRequestState()
      ↓
Observable<RequestState<T>>
```

Conceptually:

```text
Observable<T>
      │
      ├── startWith()
      │       ↓
      │    loading
      │
      ├── map()
      │       ↓
      │    success + data
      │
      └── catchError()
              ↓
          ApiErrorService
              ↓
          error + ApiError
```

The component can then store the state in a signal.

Example:

```ts
signal<RequestState<string>>({
  status: 'idle',
});
```

This separates:

```text
Application state
    ↓
AuthState

Request state
    ↓
RequestState<T>
```

---

# 32. Important `inject()` Lesson

During the request-state experiment, the first version attempted to use:

```ts
inject(ApiErrorService)
```

inside the normal utility function.

When the utility was called from a button event handler, Angular produced an injection-context error.

The lesson was:

> `inject()` requires an appropriate Angular injection context.

The final design makes the dependency explicit.

The component injects the service:

```ts
private readonly apiErrorService =
  inject(ApiErrorService);
```

and passes it to the utility:

```ts
toRequestState(
  request$,
  this.apiErrorService,
);
```

This keeps the utility independent of Angular's dependency-injection context.

---

# 33. Request-State Test Page

Location:

```text
pages/request-state-test/
```

Temporary route:

```text
/request-state-test
```

This page was created specifically to learn and test the request-state abstraction without modifying the working authentication system.

It tests:

```text
idle
loading
success
error
```

The page uses test Observables rather than application-specific API logic.

This allows the request-state pattern to be understood independently before applying it to real application pages.

It is a development/learning page and can eventually be removed when the learning/testing phase is complete.

---

# 34. Landing Page

Location:

```text
pages/landing/
```

Route:

```text
/
```

The landing page is public.

It belongs under `pages/` because it is a user-facing screen rather than reusable infrastructure.

---

# 35. Login Page

Location:

```text
pages/auth/login/
```

Route:

```text
/login
```

The Login page is responsible for:

```text
form interaction
client-side validation
calling AuthService
handling API errors
authentication state
navigation
```

The form uses Angular Reactive Forms.

Current fields:

```text
username
password
```

The page uses the reusable Button component.

---

# 36. Signals and UI State

Angular Signals are used for simple reactive component UI state.

For example:

```ts
signal(false)
```

can represent:

```text
isSubmitting
menu open/closed
error message
```

Reactive Forms remain responsible for:

```text
form values
validation
touched state
control errors
```

Signals are responsible for:

```text
component UI state
```

The distinction is:

```text
Reactive Forms
    → form state

Signals
    → component UI state
```

---

# 37. Register Page

Location:

```text
pages/auth/register/
```

Route:

```text
/register
```

Registration currently contains:

```text
username
email
password
password confirmation
```

The component handles:

```text
Reactive Forms
client-side validation
password confirmation
registration API
server field errors
form-level errors
navigation after success
```

The server remains authoritative for validation.

---

# 38. Guest Page

Location:

```text
pages/guest/
```

Route:

```text
/guest
```

The Guest page is currently a generic foundation.

The starter intentionally does not hard-code application-specific guest behavior.

For example, a future application can build:

```text
guest sessions
temporary progress
guest quizzes
guest limits
```

on top of this foundation.

---

# 39. Protected App Page

Location:

```text
pages/app/
```

Route:

```text
/app
```

This is the protected application area.

The route is wrapped by:

```text
AppLayout
```

and protected by:

```ts
authGuard
```

The current page is intentionally generic.

An actual application built from this starter can replace it with application-specific features.

---

# 40. Developer Test Pages

The starter currently contains temporary development pages:

```text
pages/auth-test/
pages/request-state-test/
```

## Auth Test

Used to test:

```text
authenticated requests
unauthenticated requests
protected endpoints
token refresh
concurrent requests
```

## Request State Test

Used to test:

```text
idle
loading
success
error
```

These pages are useful during development but are candidates for removal when the corresponding learning/testing phase is complete.

---

# 41. Important Separation of Responsibilities

The starter follows these boundaries.

## Component

Responsible for:

```text
UI
form interaction
user-facing messages
navigation
component-level UI state
```

## Service

Responsible for:

```text
API requests
reusable infrastructure operations
```

## Interceptor

Responsible for:

```text
cross-cutting HTTP behavior
cookies
CSRF header
401 refresh/retry
```

## API Error Service

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

## Request State

Responsible for:

```text
standardized API request lifecycle state
```

## Layout

Responsible for:

```text
composing reusable visual components
providing common page structure
```

## Design Component

Responsible for:

```text
one reusable visual responsibility
```

Examples:

```text
AppBar
BottomNavigation
MinimalHeader
SimpleFooter
```

## Django

Responsible for:

```text
authentication authority
authorization
validation
JWT validation
CSRF validation
backend security
```

---

# 42. Architecture Decision: Library vs Layout

One of the most important architectural decisions in this project is the distinction between **design components** and **layouts**.

The design library is a catalog:

```text
Design Library
    │
    ├── Headers
    ├── Navigation
    └── Footers
```

A layout chooses from that catalog:

```text
Application Layout
    │
    ├── selected header
    ├── router outlet
    ├── selected navigation
    └── selected footer
```

Therefore:

```text
Design component
    = reusable building block

Layout
    = composition

Page
    = application content
```

This keeps the starter flexible without creating an overly configurable layout component.

---

# 43. Generic Starter vs Future Application

This project is deliberately generic.

The starter should provide:

```text
Authentication
Routing
Security infrastructure
Error handling
Request state
Layouts
Design components
Shared UI primitives
```

A future application can then add:

```text
features/
├── vocabulary/
├── lessons/
├── quizzes/
├── profile/
└── history/
```

Those application-specific features should not be moved into generic starter infrastructure simply because they happen to be used by one project.

The goal is:

```text
Starter
    ↓
Reusable foundation

Application
    ↓
Domain-specific functionality
```

---

# 44. Current Routes

The current route structure is:

```text
/                       → Landing
/login                  → Login
/register               → Register
/guest                  → Guest

/app                    → Protected App
    │
    └── protected by authGuard

/auth-test              → Authentication test
/request-state-test     → Request-state test

**                      → redirect to /
```

The public pages use:

```text
PublicLayout
```

The protected application area uses:

```text
AppLayout
```

---

# 45. Current Authentication Flow

The overall authentication flow is:

```text
                    Angular
                       │
                       ↓
              Login / Register
                       │
                       ↓
                  AuthService
                       │
                       ↓
               HTTP Interceptor
                       │
                       ↓
                Django REST API
                       │
                       ↓
              HttpOnly JWT Cookies
                       │
                       ↓
                AuthState
                       │
                       ↓
                Authenticated UI
```

For an expired access token:

```text
Protected API request
        ↓
       401
        ↓
AuthInterceptor
        ↓
Refresh endpoint
        ↓
new access token
        ↓
retry original request
```

For concurrent expiration:

```text
A → 401 ┐
B → 401 ├──→ ONE refresh
C → 401 ┘       ↓
             retry all
```

---

# 46. Security Principles

The starter follows these principles.

## JWTs

JWTs are stored in:

```text
HttpOnly cookies
```

not:

```text
localStorage
sessionStorage
```

## CSRF

Cookie-authenticated state-changing requests use CSRF protection.

## Server Authority

Django remains authoritative for:

```text
authentication
authorization
validation
```

## Frontend Guards

Angular guards improve frontend navigation but do not replace backend authorization.

## Error Handling

Do not expose unnecessary backend implementation details to users.

Normalize API errors before pages consume them.

## Logging

Do not log:

```text
passwords
JWTs
refresh tokens
sensitive authentication data
```

## Refresh

Expired access tokens are refreshed through the backend refresh endpoint rather than storing tokens in browser storage.

---

# 47. Useful Angular Commands

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

# 48. Useful npm Commands

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

Run the project:

```bash
npm start
```

The exact npm scripts are defined in:

```text
package.json
```

---

# 49. How to Decide Where New Code Belongs

When adding something new, ask these questions.

## Is it reusable infrastructure?

Put it under:

```text
core/
```

Examples:

```text
authentication
API services
guards
interceptors
error handling
request state
configuration
```

---

## Is it reusable visual structure?

Consider:

```text
layouts/
```

or:

```text
layouts/designs/
```

Examples:

```text
headers
navigation
footers
application shells
```

---

## Is it a small reusable UI primitive?

Consider:

```text
shared/ui/
```

Examples:

```text
button
```

Only create a shared component when it provides a clear reusable responsibility.

---

## Is it a screen the user visits?

Put it under:

```text
pages/
```

Examples:

```text
login
register
landing
guest
app
```

---

## Is it application-specific domain logic?

Keep it out of the generic starter.

For example:

```text
vocabulary
lessons
quizzes
HSK
flashcards
```

belong to the actual application built on top of this starter.

---

# 50. Component Abstraction Lesson

A major lesson from building this starter is:

> Reusability is about responsibility, not merely repetition.

Good reusable components have a clear purpose.

For example:

```text
Button
    → reusable button behavior and styling

AppBar
    → reusable application header

BottomNavigation
    → reusable navigation structure

MinimalHeader
    → reusable public header

SimpleFooter
    → reusable footer
```

A component should not be created merely because some HTML appears more than once.

Before creating an abstraction, ask:

```text
Does it have a clear responsibility?

Will it be reused?

Does it make consuming code simpler?

Does it hide meaningful implementation detail?

Does it avoid unnecessary coupling?
```

If the answer is mostly no, keeping the markup local may be better.

---

# 51. Current Architecture Checkpoint

The reusable layout architecture has now been tested.

```text
AppLayout                    ✅
PublicLayout                 ✅
AppBar                       ✅
BottomNavigation             ✅
MinimalHeader                ✅
SimpleFooter                 ✅
Button                       ✅
Routing                      ✅
Protected /app route         ✅
```

The authentication foundation is also working:

```text
Login                        ✅
Register                     ✅
JWT HttpOnly cookies         ✅
CSRF                         ✅
Auth state                   ✅
Auth guard                   ✅
Automatic refresh            ✅
Concurrent refresh           ✅
Logout                       ✅
API error normalization      ✅
Field-level API errors       ✅
Global error handler         ✅
RequestState<T>              ✅
toRequestState()             ✅
```

---

# 52. Current Learning Progress

The major learning checkpoints completed so far are:

```text
Angular project creation          ✅
Standalone components             ✅
Routing                            ✅
Login page                         ✅
Register page                      ✅
Guest foundation                   ✅

Reactive Forms                     ✅
Angular Signals                    ✅
AuthService                        ✅
AuthState                          ✅
CSRF service                       ✅
HTTP interceptor                   ✅
JWT cookie authentication          ✅
Auth guard                         ✅
Application initializer            ✅

Automatic token refresh            ✅
Concurrent refresh protection      ✅

API error normalization            ✅
Global error handling              ✅
Server field errors                ✅

RequestState<T>                    ✅
Request-state utility              ✅
Loading/success/error testing      ✅

Reusable Button                    ✅

AppLayout                           ✅
AppBar                              ✅
BottomNavigation                    ✅

PublicLayout                        ✅
MinimalHeader                       ✅
SimpleFooter                        ✅

Design-library architecture        ✅
Layout composition architecture    ✅
FormField abstraction evaluated    ✅
FormField abstraction removed      ✅
```

---

# 53. Current Architecture Mental Model

The complete architecture can now be summarized as:

```text
                         ANGULAR STARTER
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ↓                      ↓                      ↓
      CORE                  LAYOUTS                 PAGES
        │                      │                      │
        │                      │                      ├── Landing
        │                      │                      ├── Login
        │                      │                      ├── Register
        │                      │                      ├── Guest
        │                      │                      └── App
        │                      │
        │                      ├── PublicLayout
        │                      │      │
        │                      │      ├── Header
        │                      │      ├── RouterOutlet
        │                      │      └── Footer
        │                      │
        │                      └── AppLayout
        │                             │
        │                             ├── AppBar
        │                             ├── RouterOutlet
        │                             └── Navigation
        │
        ├── Auth
        ├── Config
        ├── Errors
        ├── Guards
        ├── Initialization
        ├── Interceptors
        └── Request State
                               │
                               ↓
                       SHARED UI
                               │
                               └── Button
                               │
                               ↓
                         DJANGO REST API
```

The fundamental relationship is:

```text
Core
    = infrastructure

Design Library
    = reusable visual building blocks

Layouts
    = composition

Pages
    = user-facing screens

Shared UI
    = small reusable primitives

Django
    = backend authority
```

---

# 54. What Comes Next

This architecture checkpoint is now complete.

The next phase can focus on expanding the design library with additional alternatives rather than changing the underlying architecture.

The design library can grow independently:

```text
Public Headers
    ├── Minimal
    ├── Centered
    └── Hamburger

Public Navigation
    └── Bottom

Public Footers
    ├── Simple
    └── Columns

App Headers
    ├── Simple
    ├── Dashboard
    └── App Bar

App Navigation
    ├── Sidebar
    └── Bottom
```

The important rule remains:

> Add alternatives to the design library without turning the layouts into a giant configurable component.

A new project should be able to choose the components it wants and compose them explicitly in its layouts.

---

# 55. Beginner Cheat Sheet

When you forget what something does:

```text
main.ts
    → starts Angular

app.config.ts
    → configures Angular

app.routes.ts
    → defines routes

core/
    → reusable infrastructure

layouts/
    → reusable page structure

layouts/designs/
    → reusable visual components

pages/
    → user-facing screens

shared/ui/
    → small reusable UI primitives

service
    → reusable logic / API communication

model/interface
    → describes data shape

guard
    → protects frontend routes

interceptor
    → handles cross-cutting HTTP behavior

initializer
    → runs application startup logic

ErrorHandler
    → unexpected runtime errors

ApiErrorService
    → normalizes backend HTTP errors

RequestState<T>
    → represents request lifecycle

signal()
    → reactive UI state

signal.set(...)
    → updates signal state

Reactive Forms
    → form values and validation

Django
    → backend authority
```

---

# 56. Architecture Principle to Remember

The most important principle for this starter is:

> **Keep infrastructure reusable, keep design components independent, let layouts compose those components, and keep application-specific behavior inside pages/features.**

In short:

```text
Reusable infrastructure
        ↓
      core/

Reusable visual building blocks
        ↓
 layouts/designs/

Page composition
        ↓
    layouts/

User-facing screens
        ↓
    pages/

Small reusable UI
        ↓
  shared/ui/

Application-specific domain
        ↓
 future application
```

This gives the starter a clear foundation that can be reused for different Angular + Django applications without carrying domain-specific assumptions into the template.
