# Phase 5.5 — Register Page Integration

## Overview

The Register page is now integrated into the reusable `PublicLayout`.

Like the Login integration, this step intentionally keeps the existing registration behavior unchanged. The primary goal was to make the Register page work correctly as a child route of the shared public layout.

The resulting structure is:

```text
App
│
└── PublicLayout
    ├── Header
    ├── RouterOutlet
    │   └── Register
    └── Footer
```

The Register page continues to own registration-specific behavior, while `PublicLayout` owns the shared public-page structure.

---

# 1. Register's Responsibility

The Register page is responsible for:

* displaying the registration form
* validating registration fields locally
* validating password confirmation
* submitting registration data
* handling API errors
* displaying server-side field errors
* displaying loading state
* navigating to Login after successful registration

It is not responsible for:

* creating users directly
* performing server-side validation
* managing JWT cookies
* providing the global header
* providing the global footer
* controlling the application's overall viewport

Those responsibilities belong to the appropriate backend services or shared frontend infrastructure.

---

# 2. Register Component Structure

The Register page contains:

```text
src/app/pages/auth/register/
├── register.ts
├── register.html
└── register.css
```

The TypeScript component contains the registration behavior.

The HTML template contains the form and user-facing states.

The CSS controls only the Register page's presentation.

---

# 3. Registration Form

The form contains four fields:

```text
Username
Email
Password
Confirm password
```

The Angular form uses:

```ts
this.fb.nonNullable.group(...)
```

This provides strongly defined form values without `null` values for these controls.

The fields use the following client-side validation:

```text
Username
└── required

Email
├── required
└── valid email format

Password
├── required
└── minimum 8 characters

Confirm password
└── required
```

There is also a form-level password matching validator.

---

# 4. Password Confirmation

Password confirmation is different from ordinary field validation because it compares two controls:

```text
password
     │
     ├──────────┐
     │          │
     ▼          ▼
 password == password_confirm
```

The custom validator returns:

```ts
{
  passwordMismatch: true
}
```

when the two values do not match.

The template then displays:

```text
Passwords do not match.
```

This is a good example of **form-level validation** rather than validation belonging to only one individual field.

---

# 5. Request State

Register uses the reusable `RequestState` abstraction:

```ts
signal<RequestState<ApiMessageResponse>>({
  status: 'idle',
});
```

The registration request therefore follows the same predictable lifecycle as Login:

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

The template uses this state to:

* disable the submit button while submitting
* change the button text
* display an API error message

For example:

```text
idle
   → Create Account

loading
   → Creating account...

success
   → navigate to /login

error
   → display error
```

This keeps the Register page consistent with the rest of the application's request-state architecture.

---

# 6. API Error Handling

Register uses:

```ts
toRequestState(
  this.authService.register(formValue),
  this.apiErrorService,
)
```

The component therefore does not need to understand the raw structure of every possible HTTP error.

`ApiErrorService` converts API failures into the application's common error representation.

Register can then handle:

```text
success
or
error
```

and, when available, apply field-specific errors.

---

# 7. Server-Side Field Errors

One important part of Register is handling validation errors returned by Django.

For example:

```text
POST /api/auth/register/
        │
        ▼
Django validation
        │
        ▼
username already exists
```

The backend can return a field error associated with:

```text
username
```

The Register component maps that error to the corresponding Angular form control.

Conceptually:

```text
Backend field error
       │
       ▼
fieldErrors
       │
       ▼
registerForm.get(fieldName)
       │
       ▼
Angular control
       │
       ▼
display error beside field
```

This is different from client-side validation.

The frontend provides immediate feedback for obvious problems, while the backend remains authoritative.

---

# 8. Clearing Previous Server Errors

Before a new submission:

```ts
this.clearServerErrors();
```

is called.

This prevents an old server error from remaining visible after the user has corrected the value.

For example:

```text
First submission

Username:
alice

Backend:
"Username already exists."

       ↓

User changes username

Username:
alice123

       ↓

New submission
```

The old server error should not remain attached to the field indefinitely.

The `clearServerErrors()` method removes only the custom `server` errors while preserving other validation errors.

This distinction is important:

```text
required
email
minlength
passwordMismatch
```

should not accidentally be removed when clearing server errors.

---

# 9. Applying Server Errors

The `applyFieldErrors()` method looks up each backend field:

```ts
const control = this.registerForm.get(fieldName);
```

If a matching control exists, the first returned message is attached as:

```ts
server: messages[0]
```

The template can then display it using:

```html
registerForm.controls.username.getError('server')
```

This gives us a reusable pattern for server-side validation.

The backend remains the source of truth, while Angular presents the result in the appropriate field.

---

# 10. Successful Registration

A successful registration does not automatically authenticate the user.

Instead:

```text
Register
   │
   ▼
POST /api/auth/register/
   │
   ▼
Success
   │
   ▼
Navigate to /login
```

The user can then explicitly sign in.

This keeps registration and authentication as separate operations.

The Login page remains responsible for establishing the authenticated application state.

---

# 11. Register and PublicLayout

Before the layout integration, Register used:

```css
min-height: 100vh;
```

After integration, this was changed to:

```css
min-height: 100%;
```

The reason is the same as Login.

`PublicLayout` already owns the viewport:

```text
PublicLayout
└── min-height: 100vh
```

Register should fill the available layout space rather than creating another viewport-sized container:

```text
PublicLayout
└── Register
    └── min-height: 100%
```

This avoids unnecessary nested viewport calculations.

---

# 12. Shared Layout vs Page

The architecture now clearly separates responsibilities.

### PublicLayout

```text
Header
Main content area
Footer
Shared public-page structure
Responsive outer spacing
```

### Register

```text
Registration form
Validation
Request state
API errors
Server field errors
Registration navigation
```

This means Register can change independently without requiring changes to the public layout.

Likewise, the public layout can be redesigned without rewriting the registration logic.

---

# 13. Navigation

Register provides links to the other public authentication flows:

```text
Back to home
      ↓
     /

Already have an account?
      ↓
    /login

Continue as Guest
      ↓
    /guest
```

These use Angular `RouterLink` rather than normal browser navigation.

This allows Angular's router to handle navigation within the single-page application.

---

# 14. Responsive Design

Register uses the same responsive principles as Login.

Desktop:

```text
┌──────────────────────────────────────────────┐
│                Public Header                 │
├──────────────────────────────────────────────┤
│                                              │
│             Create Account                   │
│                                              │
│              Registration                   │
│                 Form                         │
│                                              │
├──────────────────────────────────────────────┤
│                Public Footer                 │
└──────────────────────────────────────────────┘
```

Mobile:

```text
┌──────────────────────┐
│    Public Header     │
├──────────────────────┤
│                      │
│   Create Account     │
│                      │
│   Registration Form  │
│                      │
├──────────────────────┤
│    Public Footer     │
└──────────────────────┘
```

The form remains fluid and uses the available content width.

At smaller screen sizes:

* page spacing is reduced
* heading size is reduced
* the card can use the available width
* inputs remain full width

---

# 15. Why We Did Not Rewrite `register.ts`

The existing Register logic was already working correctly.

Therefore this integration step intentionally avoided unnecessary changes.

The principle is:

> Integrate working features into shared infrastructure without rewriting their business behavior.

This makes changes easier to test and easier to troubleshoot.

The Register component already had:

* Reactive Forms
* validation
* RequestState
* API error handling
* server field errors
* navigation

Those features remain intact.

Only the presentation needed to adapt to the new shared layout.

---

# 16. Testing Checklist

The Register page was tested after integrating it into `PublicLayout`.

### Navigation

* [x] `/register` loads correctly
* [x] Back to home works
* [x] Sign in link works
* [x] Continue as Guest works

### Form validation

* [x] Username required validation works
* [x] Email required validation works
* [x] Invalid email validation works
* [x] Password required validation works
* [x] Password minimum-length validation works
* [x] Password confirmation required validation works
* [x] Password mismatch validation works

### Registration behavior

* [x] Request state is displayed correctly
* [x] Submit button is disabled while loading
* [x] Server validation errors can be displayed
* [x] Successful registration navigates to `/login`

### Layout

* [x] Register displays correctly inside PublicLayout
* [x] Header remains visible
* [x] Footer remains visible
* [x] No nested `100vh` problem
* [x] Desktop layout works
* [x] Mobile layout works

---

# 17. Current Public Authentication Structure

The public authentication area is now:

```text
PublicLayout
│
├── Landing
│   └── /
│
├── Login
│   └── /login
│
├── Register
│   └── /register
│
└── Guest
    └── /guest
```

The protected application remains separate:

```text
/app
└── protected by authGuard
```

This separation will become important when the authenticated `AppLayout` is introduced.

---

# 18. Architecture Checkpoint

Completed:

```text
5.1 Create PublicLayout       ✅
5.2 Test PublicLayout         ✅
5.3 Integrate Landing        ✅
5.4 Integrate Login          ✅
5.5 Integrate Register       ✅
```

Next:

```text
5.6 Integrate Guest
```

After Guest:

```text
5.7 Create AppLayout
5.8 Move /app into AppLayout
5.9 Extract reusable UI primitives
5.10 Responsive polish
```

---

# 19. Main Lessons

### Layouts provide shared structure

PublicLayout owns the common public experience.

### Pages provide feature behavior

Register owns registration.

### Client validation and server validation are different

Angular provides immediate UX feedback, but Django remains authoritative.

### Server errors should map back to form controls

This creates a better user experience without duplicating backend validation rules.

### RequestState provides a consistent request lifecycle

Register follows the same pattern as Login.

### Avoid rewriting working logic during layout work

The goal of this checkpoint was integration, not unnecessary refactoring.

### Shared layouts reduce duplication

Landing, Login, Register, and Guest can all use the same public structure.

---

# 20. Checkpoint

**Phase 5.5 — Register Integration: COMPLETE**

The Register page is now successfully integrated into the reusable `PublicLayout`.

The public authentication pages completed so far are:

```text
Landing      ✅
Login        ✅
Register     ✅
Guest        ← next
```

The next step is **Phase 5.6 — Integrate Guest**.

Before changing Guest, inspect its existing implementation first. We should preserve whatever useful structure or logic is already there and make only the changes necessary for PublicLayout integration.
