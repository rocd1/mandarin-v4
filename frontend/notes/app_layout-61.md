# Phase 5.7 — Create AppLayout

## Purpose

Create a reusable layout for the authenticated/application area of the Angular starter.

The public pages already use `PublicLayout`. The authenticated part of the application needs its own layout so that future protected pages can share the same application header, main content area, and footer.

The important idea is:

> A layout provides shared structure; a page provides the actual content.

---

## Current Architecture

The application now has two layout concepts:

```text
src/app/
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
        └── app.css
```

The distinction is intentional.

### PublicLayout

Used by public-facing pages:

```text
PublicLayout
├── Header
├── RouterOutlet
│   ├── Landing
│   ├── Login
│   ├── Register
│   └── Guest
└── Footer
```

### AppLayout

Will be used by authenticated application pages:

```text
AppLayout
├── Application Header
├── RouterOutlet
│   ├── Dashboard
│   ├── Other protected pages
│   └── ...
└── Application Footer
```

The protected page currently located at:

```text
src/app/pages/app/
```

is **not the layout**.

It is the page that will eventually be rendered inside `AppLayout`.

---

## Why Create a Separate AppLayout?

Public and authenticated areas normally have different UI responsibilities.

The public area needs things such as:

* Landing
* Sign in
* Registration
* Guest entry

The authenticated area will eventually need things such as:

* Application navigation
* Dashboard
* User/profile controls
* Logout
* Application-specific navigation
* Protected pages

Keeping these concerns separate prevents the public layout from becoming responsible for authenticated application behavior.

---

## AppLayout Component

The component is:

```text
src/app/layouts/app-layout/app-layout.ts
```

It imports:

```ts
RouterLink
RouterOutlet
```

`RouterLink` allows the application brand to navigate back to `/app`.

`RouterOutlet` is the important part because it provides the location where child protected pages will be rendered.

The layout itself does not contain application-specific page logic.

---

## AppLayout Template

The current structure is:

```html
<div class="app-layout">
  <header class="app-header">
    <a routerLink="/app" class="brand">
      Project App Starter
    </a>
  </header>

  <main class="app-main">
    <router-outlet />
  </main>

  <footer class="app-footer">
    <p>Project App Starter</p>
  </footer>
</div>
```

Conceptually:

```text
┌──────────────────────────────────────────┐
│          Application Header              │
├──────────────────────────────────────────┤
│                                          │
│              RouterOutlet                │
│                                          │
│        Protected Page Content            │
│                                          │
├──────────────────────────────────────────┤
│          Application Footer              │
└──────────────────────────────────────────┘
```

The `RouterOutlet` is deliberately empty at this stage.

Its purpose will become clearer when `/app` is converted to a parent route with child routes.

---

## Layout vs Page

This distinction is important for Angular architecture.

### Layout

Responsible for:

* Shared structure
* Header
* Footer
* Navigation
* Common spacing
* Application-wide visual shell

Example:

```text
AppLayout
├── Header
├── RouterOutlet
└── Footer
```

### Page

Responsible for:

* Page-specific content
* Forms
* Tables
* Dashboard widgets
* Application features
* Page-specific interactions

Example:

```text
Dashboard
├── Welcome message
├── Statistics
└── Recent activity
```

Therefore:

```text
AppLayout ≠ Dashboard
```

and:

```text
AppLayout ≠ Protected Page
```

The layout contains the page.

---

## Why `pages/app` Is Still Separate

The existing folder:

```text
src/app/pages/app/
```

represents a **page**, while:

```text
src/app/layouts/app-layout/
```

represents the **layout**.

Eventually the relationship will look like:

```text
/app
└── AppLayout
    └── Dashboard
```

The current `pages/app` component can therefore remain in place while the layout is introduced.

We will handle that relationship in the next phase.

---

## Responsive Design

`AppLayout` follows the same responsive principles as `PublicLayout`.

On larger screens:

```text
Viewport
┌──────────────────────────────────────────────┐
│ Header                                        │
├──────────────────────────────────────────────┤
│       Main content — max-width: 960px        │
│                                              │
├──────────────────────────────────────────────┤
│ Footer                                        │
└──────────────────────────────────────────────┘
```

On smaller screens:

```text
┌──────────────────────┐
│ Header               │
├──────────────────────┤
│  Main content        │
│  with smaller        │
│  horizontal padding  │
├──────────────────────┤
│ Footer               │
└──────────────────────┘
```

The layout uses:

```css
min-height: 100vh;
```

because the layout itself owns the full viewport height.

The child pages should **not** need their own `100vh` layout.

This avoids the nested-viewport problem encountered while integrating the public pages.

---

## Why the Layout Owns `100vh`

The layout is the top-level visual shell:

```text
AppLayout
└── full viewport
    ├── Header
    ├── Main
    └── Footer
```

Therefore it is the correct place for:

```css
min-height: 100vh;
```

The main area uses:

```css
flex: 1;
```

which allows the footer to remain at the bottom when the page has little content.

This gives us the basic application-shell behavior:

```text
Header
   ↓
Flexible content area
   ↓
Footer
```

---

## Why Navigation Is Not Added Yet

The first version intentionally contains only the brand.

We could immediately add:

```text
Dashboard
Profile
Logout
```

but that would mix several upcoming concerns into one step.

The current goal is only:

> Create and understand the authenticated application layout.

Navigation can be added after the layout is correctly connected to child routes.

This keeps each architectural step small and easier to debug.

---

## Routing

At this stage, the existing `/app` route is intentionally left unchanged.

The current architecture is still conceptually:

```text
/app
└── Protected App Page
```

The next step will change this into:

```text
/app
└── AppLayout
    └── Protected Page
```

This will introduce nested routing.

The existing `authGuard` remains responsible for protecting the `/app` area.

The AppLayout itself does **not** replace the authentication guard.

---

## Authentication Responsibility

`AppLayout` does not perform authentication.

Authentication remains handled by the existing authentication infrastructure:

```text
AuthService
AuthStateService
AuthInterceptor
AuthGuard
```

The responsibilities remain separated:

```text
AuthService
    ↓
Authentication API communication

AuthStateService
    ↓
Current authentication state

AuthInterceptor
    ↓
Credentials / refresh handling

AuthGuard
    ↓
Protect application routes

AppLayout
    ↓
Authenticated application UI structure
```

This separation keeps the layout focused on presentation and structure.

---

## Testing

After creating `AppLayout`, verify that:

* Angular compiles successfully.
* The existing public routes still work.
* `/` still displays through `PublicLayout`.
* `/login` still works.
* `/register` still works.
* `/guest` still works.
* `/app` still remains protected.
* Existing authentication behavior is unchanged.
* No authentication or interceptor code needed to be modified.

At this checkpoint, `AppLayout` exists but is not yet responsible for rendering the `/app` page.

That is intentional.

---

## Important File Locations

### Root application component

```text
src/app/app.ts
src/app/app.html
src/app/app.css
```

This is the root Angular application component and contains the top-level:

```html
<router-outlet />
```

It should not be confused with the protected application page.

### Protected application page

```text
src/app/pages/app/
```

This is the page currently associated with `/app`.

### Authenticated layout

```text
src/app/layouts/app-layout/
```

This is the reusable application shell created in Phase 5.7.

Keeping these three concepts separate is important:

```text
Root App
    ↓
Router
    ↓
AppLayout
    ↓
Protected Page
```

---

## What We Learned

### 1. Layouts and pages have different responsibilities

A layout provides shared structure.

A page provides feature-specific content.

### 2. The root `App` is not the same as `AppLayout`

The root `App` hosts the application's top-level router.

`AppLayout` provides the visual structure for the authenticated section.

### 3. Nested `RouterOutlet` enables nested application structure

The AppLayout's `RouterOutlet` will eventually display child routes.

### 4. Authentication and presentation should remain separate

The layout should not contain JWT, cookie, refresh, or authentication logic.

### 5. `100vh` belongs at the layout level

The layout owns the viewport.

Child pages should use the space provided by the layout rather than creating another viewport-sized shell.

### 6. Small architectural steps make debugging easier

Instead of creating the layout, navigation, dashboard, profile, and logout at once, we first create the reusable shell.

---

## Checkpoint

**Phase 5.7 — Create AppLayout: COMPLETE**

The authenticated application layout has been created and tested without changing the existing routing or authentication behavior.

Next:

**Phase 5.8 — Move `/app` into AppLayout**

Target:

```text
/app
└── AppLayout
    └── Protected App Page
```

This is where nested routing will become active.
