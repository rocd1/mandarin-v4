# Login Page Integration

## Overview

The Login page is the first authentication page integrated into the reusable `PublicLayout`.

The goal of this step was **not to change the authentication logic**. The existing Login component was already working correctly.

Instead, the work focused on making the Login page fit naturally inside the shared public layout while keeping responsibilities separated.

The final structure is:

```text
App
│
└── PublicLayout
    ├── Header
    ├── RouterOutlet
    │   └── Login
    └── Footer
```

This keeps the public layout responsible for the overall page structure while Login remains responsible only for signing users in.

---

# 1. Login's Responsibility

The Login page is responsible for:

* displaying the login form
* validating the form locally
* submitting username and password
* calling `AuthService`
* retrieving the authenticated user after login
* updating `AuthStateService`
* navigating to `/app`
* displaying loading and error states

It should **not** be responsible for:

* creating JWTs
* storing JWTs
* managing authentication cookies
* validating authentication on the server
* providing the site's global header
* providing the site's global footer
* controlling the overall viewport layout

Those responsibilities belong elsewhere.

This separation is important for a reusable starter.

---

# 2. Login Component Structure

The Login component contains three files:

```text
src/app/pages/auth/login/
├── login.ts
├── login.html
└── login.css
```

### `login.ts`

The TypeScript file contains the page's behavior:

```text
Login
│
├── FormBuilder
├── AuthService
├── AuthStateService
├── ApiErrorService
├── Router
└── RequestState
```

The component does not directly manage JWT cookies.

The browser receives and sends the HttpOnly authentication cookies automatically through the HTTP layer.

---

# 3. Login Request Flow

A successful login follows this sequence:

```text
User submits form
       │
       ▼
Login component
       │
       ▼
AuthService.login()
       │
       ▼
POST /api/auth/login/
       │
       ▼
Django authenticates user
       │
       ▼
JWT cookies are set
       │
       ▼
Login component calls getCurrentUser()
       │
       ▼
GET /api/auth/me/
       │
       ▼
Authenticated User returned
       │
       ▼
AuthStateService.setUser()
       │
       ▼
Navigate to /app
```

The important lesson is that a successful login response alone does not need to contain the complete user object.

The frontend performs a separate `/me/` request to establish the application's current authenticated user state.

---

# 4. Why `/me/` Is Called After Login

The Login flow intentionally uses:

```ts
this.authService.login(formValue).pipe(
  switchMap(() =>
    this.authService.getCurrentUser(),
  ),
)
```

This gives the frontend a reliable source of truth for the current user.

The flow is:

```text
login()
  │
  └── success
        │
        ▼
      /me/
        │
        ├── success → authenticated user
        │
        └── error   → login flow fails
```

This prevents the application from navigating into the protected application area merely because the login request returned `200`.

The server remains authoritative.

---

# 5. Why `switchMap()` Is Used

The Login operation consists of two dependent HTTP requests:

```text
login()
   ↓
getCurrentUser()
```

The second request should only happen after the first succeeds.

`switchMap()` expresses that relationship:

```ts
this.authService.login(formValue).pipe(
  switchMap(() =>
    this.authService.getCurrentUser(),
  ),
)
```

This is cleaner than manually subscribing to the login request and then creating another subscription inside it.

The result is one observable flow:

```text
login → get user → update state → navigate
```

---

# 6. Request State

Login uses the reusable `RequestState` abstraction:

```ts
protected readonly requestState =
  signal<RequestState<User>>({
    status: 'idle',
  });
```

The state can represent:

```text
idle
 │
 ▼
loading
 │
 ├── success
 │
 └── error
```

The important detail is that the Login page is tracking the final result as:

```ts
RequestState<User>
```

because the successful operation ultimately produces the authenticated `User`.

This allows the template to handle:

* idle state
* loading state
* successful request
* API failure

without creating separate boolean variables such as:

```ts
isLoading
hasError
loginSuccessful
```

---

# 7. Loading State

While the request is running, the button changes:

```html
{{ 
  requestState().status === 'loading'
    ? 'Signing in...'
    : 'Sign In'
}}
```

The button is also disabled:

```html
[disabled]="requestState().status === 'loading'"
```

This prevents repeated submissions while authentication is in progress.

The component also protects the method itself:

```ts
if (this.requestState().status === 'loading') {
  return;
}
```

This gives us two layers of protection:

```text
UI
└── disabled button

Component
└── ignores duplicate submission
```

---

# 8. Local Form Validation

The Login form performs simple client-side validation:

```ts
username: ['', [Validators.required]],
password: ['', [Validators.required]],
```

The browser/frontend can therefore immediately detect:

```text
Username is required.
Password is required.
```

However, this validation is only a user-experience improvement.

It is **not a security boundary**.

The backend must always validate credentials independently.

---

# 9. API Error Handling

Login uses the reusable `ApiErrorService` through:

```ts
toRequestState(
  this.authService.login(...),
  this.apiErrorService,
)
```

This keeps API error interpretation outside the Login component.

The component only needs to understand:

```text
success
or
error
```

For example, an invalid login can produce a safe user-facing message without exposing sensitive backend details.

The Login page should never display:

* passwords
* JWTs
* refresh tokens
* internal stack traces
* sensitive server information

---

# 10. Authentication State

After `/me/` succeeds:

```ts
this.authStateService.setUser(state.data);
```

The user object is stored in the application's in-memory authentication state.

This is different from storing a JWT.

The architecture deliberately does **not** store authentication tokens in:

```text
localStorage
sessionStorage
```

Authentication tokens remain in HttpOnly cookies managed by the browser.

The Angular application only needs the authenticated user's application state.

---

# 11. Navigation After Successful Login

After authentication is established:

```ts
void this.router.navigate(['/app']);
```

The user is sent to the protected application area.

The route itself is protected by:

```ts
canActivate: [authGuard]
```

Therefore:

```text
Login
  │
  ▼
AuthStateService
  │
  ▼
/app
  │
  ▼
authGuard
  │
  ├── authenticated → allow
  │
  └── unauthenticated → redirect
```

The guard is an additional frontend navigation control.

It does not replace backend authentication and authorization.

---

# 12. Login and PublicLayout

Before PublicLayout, Login used:

```css
.auth-page {
  min-height: 100vh;
}
```

Once Login became a child of PublicLayout, this was no longer appropriate.

The layout already owns the viewport:

```css
.public-layout {
  min-height: 100vh;
}
```

Therefore Login was changed to use:

```css
.auth-page {
  min-height: 100%;
}
```

This avoids creating a second viewport-sized container inside the layout.

The resulting hierarchy is:

```text
PublicLayout
└── min-height: 100vh

    Login
    └── min-height: 100%
```

This is an important layout lesson:

> The shared layout should own the page-level viewport height. Individual pages should normally fill the available space rather than creating another `100vh` viewport.

---

# 13. Login Page vs PublicLayout

The responsibilities are now separated:

### PublicLayout

Responsible for:

```text
Header
Main content area
Footer
Global public-page structure
Responsive page spacing
```

### Login

Responsible for:

```text
Login form
Form validation
Authentication request
Loading state
Error state
Authenticated user state
Navigation
```

This means other public pages can reuse the same layout without copying the header and footer.

For example:

```text
PublicLayout
├── Landing
├── Login
├── Register
└── Guest
```

Each page can focus on its own purpose.

---

# 14. Responsive Behavior

The Login page was also adjusted for smaller screens.

Desktop:

```text
┌──────────────────────────────────────────────┐
│              Public Header                   │
├──────────────────────────────────────────────┤
│                                              │
│              Login Form                      │
│                                              │
├──────────────────────────────────────────────┤
│              Public Footer                   │
└──────────────────────────────────────────────┘
```

Mobile:

```text
┌──────────────────────┐
│   Public Header      │
├──────────────────────┤
│                      │
│     Login Form       │
│                      │
├──────────────────────┤
│   Public Footer      │
└──────────────────────┘
```

The Login page uses smaller vertical and horizontal spacing on narrow screens.

The form remains fluid instead of using a fixed width.

---

# 15. Why We Did Not Change `login.ts`

The Login TypeScript logic was already working correctly.

Therefore this integration step deliberately avoided unnecessary changes.

The principle is:

> When integrating an existing working feature into a new layout, change only what the integration requires.

Changing authentication logic and layout structure at the same time would make debugging harder.

The Login behavior was already tested before this layout work.

Only the presentation/layout layer needed adjustment.

---

# 16. Testing Checklist

Login was tested after integrating it into PublicLayout.

### Navigation

* [x] `/` loads
* [x] `/login` loads
* [x] Back to home works
* [x] Create account link works
* [x] Continue as Guest link works

### Form

* [x] Empty username shows validation
* [x] Empty password shows validation
* [x] Form does not submit while invalid
* [x] Submit button enters loading state

### Authentication

* [x] Invalid credentials show an error
* [x] Valid credentials successfully log in
* [x] `/me/` successfully returns the authenticated user
* [x] Auth state is updated
* [x] Successful login navigates to `/app`

### Layout

* [x] Login displays correctly inside PublicLayout
* [x] Header remains visible
* [x] Footer remains visible
* [x] No unnecessary nested `100vh`
* [x] Desktop layout works
* [x] Mobile layout works
* [x] Form remains usable at narrow widths

---

# 17. Current Architecture Checkpoint

At this point the public application structure is:

```text
App
│
├── PublicLayout
│   ├── Header
│   ├── Landing
│   ├── Login
│   ├── Register
│   └── Guest
│
├── App
│   └── Protected application area
│
├── AuthTest
│   └── Temporary developer page
│
└── RequestStateTest
    └── Temporary developer page
```

Current public routes:

```text
/
├── /
├── /login
├── /register
└── /guest
```

Protected route:

```text
/app
```

Developer/test routes remain outside the public layout for now.

---

# 18. Main Lessons

The important lessons from this step are:

### 1. Layouts and pages have different responsibilities

A layout provides shared structure.

A page provides feature-specific content and behavior.

### 2. Avoid unnecessary `100vh`

The outer layout should normally control the viewport.

### 3. Authentication state is different from token storage

Angular stores the current user in memory.

The browser manages the HttpOnly JWT cookies.

### 4. The server remains authoritative

Frontend validation improves UX but cannot replace backend validation.

### 5. Dependent HTTP requests can form one RxJS pipeline

```text
login()
  → getCurrentUser()
  → set authentication state
  → navigate
```

### 6. RequestState keeps UI state predictable

The page can consistently handle:

```text
idle
loading
success
error
```

### 7. Working authentication logic should not be unnecessarily rewritten

This checkpoint primarily changed layout integration, not authentication behavior.

---

# 19. Checkpoint

**Phase 5.4 — Login Integration: COMPLETE**

The Login page is now integrated into the reusable PublicLayout and has been verified to work correctly.

Next:

```text
5.5 Integrate Register
```

The Register page should follow the same architectural principle:

```text
PublicLayout
└── Register
```

while keeping its existing form validation, RequestState, API error handling, and registration logic intact.
