# Phase 5.8 — Move `/app` into AppLayout

## Purpose

Connect the protected `/app` route to the new `AppLayout`.

Before this phase, `/app` directly rendered the protected application page.

After this phase, `/app` becomes a parent route that:

1. is protected by `authGuard`,
2. renders `AppLayout`,
3. renders the protected application page inside AppLayout's `RouterOutlet`.

The resulting architecture introduces Angular nested routing.

---

## Before

The `/app` route previously looked conceptually like:

```text
/app
└── Protected App Page
```

The route directly rendered the `App` component.

---

## After

The route now has a parent/child relationship:

```text
/app
└── AppLayout
    └── App
```

More precisely:

```text
/app
    │
    ├── authGuard
    │
    └── AppLayout
         │
         ├── Application Header
         │
         ├── RouterOutlet
         │      │
         │      └── App page
         │
         └── Application Footer
```

This allows future protected pages to share the same authenticated application shell.

---

# Nested Routing

The `/app` route now uses `AppLayout` as its parent component:

```ts
{
  path: 'app',
  component: AppLayout,
  canActivate: [authGuard],
  children: [
    {
      path: '',
      component: App,
    },
  ],
},
```

The important concept is the `children` property.

The empty child path:

```ts
{
  path: '',
  component: App,
}
```

means that when the user visits:

```text
/app
```

Angular renders the `App` component inside the `RouterOutlet` belonging to `AppLayout`.

---

## How the Two RouterOutlets Work

There are now multiple levels of routing.

The root Angular component contains the top-level router outlet:

```text
Root App
└── RouterOutlet
```

The router places `AppLayout` into that outlet when the user visits `/app`.

Then `AppLayout` contains another router outlet:

```text
AppLayout
└── RouterOutlet
```

Angular places the child `App` component into that second outlet.

The complete flow is:

```text
Root App
    │
    └── RouterOutlet
          │
          └── AppLayout
                │
                └── RouterOutlet
                      │
                      └── App
```

This is the foundation for the application's future protected-page structure.

---

# Layout vs Page

This phase reinforces an important architectural distinction.

## AppLayout

Located at:

```text
src/app/layouts/app-layout/
```

Its responsibility is shared application structure:

* Header
* Footer
* Application navigation in the future
* Shared application-level spacing
* Router outlet for protected pages

It should not contain page-specific feature logic.

## App Page

Located at:

```text
src/app/pages/app/
```

Its responsibility is page content.

The current page contains authentication diagnostic actions such as:

```text
Test Protected Endpoint
Test Concurrent Requests
Test Unauthenticated /me
```

These are temporary developer tests and can be replaced or removed later.

The important architectural relationship is:

```text
AppLayout
    ↓
contains
    ↓
App page
```

---

# Why `authGuard` Remains on `/app`

The authentication guard remains attached to the parent `/app` route:

```ts
{
  path: 'app',
  component: AppLayout,
  canActivate: [authGuard],
  children: [...]
}
```

This means the entire application section remains protected.

The flow is:

```text
User visits /app
       ↓
    authGuard
       ↓
 ┌─────┴─────┐
 │           │
No user    User authenticated
 │           │
BLOCK       AppLayout
             ↓
          App page
```

This is preferable to putting authentication logic inside the layout.

`AppLayout` is responsible for UI structure.

`authGuard` is responsible for route protection.

These responsibilities remain separate.

---

# Root App vs AppLayout vs App Page

There are currently three different concepts that can be confusing because of their names.

## 1. Root `App`

Located at:

```text
src/app/app.ts
```

This is the root Angular component.

Its template contains:

```html
<router-outlet />
```

Its purpose is to provide the top-level routing host.

---

## 2. `AppLayout`

Located at:

```text
src/app/layouts/app-layout/
```

This is the authenticated application's reusable visual shell.

It contains:

```text
Header
RouterOutlet
Footer
```

---

## 3. Application `App` Page

Located at:

```text
src/app/pages/app/
```

This is currently the protected application/test page.

It is rendered inside the `AppLayout` router outlet.

The relationship is:

```text
src/app/app.ts
        ↓
Root application shell

src/app/layouts/app-layout/
        ↓
Authenticated application shell

src/app/pages/app/
        ↓
Protected application page
```

These should not be treated as the same architectural layer.

---

# Public and Protected Architecture

The starter now has two separate route structures.

## Public Area

```text
PublicLayout
├── Landing
├── Login
├── Register
└── Guest
```

## Protected Area

```text
AppLayout
└── App
```

The overall application structure is:

```text
Root App
│
└── RouterOutlet
    │
    ├── PublicLayout
    │   └── RouterOutlet
    │       ├── Landing
    │       ├── Login
    │       ├── Register
    │       └── Guest
    │
    └── AppLayout
        └── RouterOutlet
            └── App
```

This gives the starter a clean separation between public and authenticated application areas.

---

# Authentication Flow

The protected route continues to work with the existing authentication architecture.

The flow is:

```text
User
 ↓
/app
 ↓
authGuard
 ↓
AuthStateService / authentication state
 ↓
Allowed
 ↓
AppLayout
 ↓
App page
```

The layout does not manage:

* JWT tokens
* Cookies
* Refresh tokens
* CSRF
* Authentication requests

Those responsibilities remain in the existing authentication services, interceptor, and guard.

---

# Testing

The following tests were performed.

## Authenticated `/app`

After logging in:

```text
/app
```

successfully displayed the AppLayout and its child application page.

The page's protected endpoint test also continued to work.

The backend returned:

```text
{
  "message": "You are authenticated."
}
```

---

## Concurrent Requests

The existing concurrent-request test continued to succeed.

Multiple protected requests returned:

```text
200 OK
```

This confirms that introducing nested routing did not break the existing authentication interceptor or refresh architecture.

---

## Logged-Out `/app`

After logging out, visiting:

```text
/app
```

was blocked by the existing `authGuard`.

This confirms that the protected route remains protected after introducing `AppLayout`.

Expected behavior:

```text
Logged out
   ↓
/app
   ↓
authGuard
   ↓
Access blocked
```

---

## Public Routes

The public routes continue to work through `PublicLayout`:

```text
/
/login
/register
/guest
```

The introduction of `AppLayout` does not interfere with the public layout.

---

# Important Architectural Lesson

A parent route can provide a persistent layout while its child routes provide the actual page content.

For example:

```text
/app
└── AppLayout
    ├── Header
    ├── RouterOutlet
    │   └── Dashboard
    └── Footer
```

Later, the same structure can support multiple protected pages:

```text
/app
└── AppLayout
    └── RouterOutlet
        ├── Dashboard
        ├── Profile
        ├── Settings
        └── ...
```

The layout does not need to be recreated for every page.

This is one of the main reasons nested routing is useful.

---

# Current Folder Structure

The relevant structure is now:

```text
src/app/
├── app.ts
├── app.html
├── app.css
│
├── layouts/
│   ├── public-layout/
│   │   ├── public-layout.ts
│   │   ├── public-layout.html
│   │   └── public-layout.css
│   │
│   └── app-layout/
│       ├── app-layout.ts
│       ├── app-layout.html
│       └── app-layout.css
│
└── pages/
    └── app/
        ├── app.ts
        ├── app.html
        ├── app.css
        └── app.spec.ts
```

---

# What We Learned

### 1. Parent routes can provide application layouts

`AppLayout` is the parent route for `/app`.

### 2. Child routes render inside the parent's `RouterOutlet`

The protected `App` page is rendered inside `AppLayout`.

### 3. The root `RouterOutlet` and nested `RouterOutlet` have different roles

The root outlet renders major application sections.

The nested outlet renders pages within a layout.

### 4. Route protection belongs to routing infrastructure

`authGuard` protects `/app`.

`AppLayout` does not perform authentication.

### 5. Layouts should remain reusable

The layout should not contain page-specific feature logic.

### 6. Public and protected areas can have independent layouts

```text
PublicLayout
    ↓
Public pages

AppLayout
    ↓
Protected pages
```

This gives the starter a scalable foundation for future application pages.

---

# Checkpoint

**Phase 5.8 — Move `/app` into AppLayout: COMPLETE**

The `/app` route now uses nested routing:

```text
/app
└── AppLayout
    └── App
```

Authentication protection remains intact, and the existing protected endpoint and concurrent-request tests continue to work.

Next:

**Phase 5.9 — Extract reusable UI primitives**
