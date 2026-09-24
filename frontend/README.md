# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.21.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

=======================================================================

# Angular Application Architecture

This document explains the architecture of the Angular frontend used by the project starter.

The frontend is built with:

* Angular standalone components
* Angular Router
* Reactive Forms
* HttpOnly cookie-based JWT authentication
* CSRF protection
* HTTP interceptors
* Route guards
* Reusable layouts
* Reusable design components
* Reusable UI components

The architecture is intentionally kept simple so it can be reused as a starter for future Django + DRF + Angular projects.

---

## 1. Project Structure

The main application structure is:

```text
src/app/
├── core/
│   ├── auth/
│   │   ├── models/
│   │   └── services/
│   ├── config/
│   ├── errors/
│   ├── guards/
│   ├── initialization/
│   ├── interceptors/
│   └── state/
│
├── layouts/
│   ├── app-layout/
│   ├── public-layout/
│   └── designs/
│       ├── app/
│       └── public/
│
├── pages/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── guest/
│   ├── landing/
│   ├── auth-test/
│   └── request-state-test/
│
└── shared/
    └── ui/
        └── button/
```

### `core/`

Contains reusable application infrastructure.

Examples:

* authentication services
* CSRF handling
* authentication state
* route guards
* HTTP interceptors
* API configuration
* error handling
* application initialization
* request state utilities

`core/` should contain infrastructure, not page-specific UI.

---

### `layouts/`

Contains reusable page composition.

A layout determines the overall structure of a screen.

For example:

```text
PublicLayout
├── Header
├── Page Content
└── Footer
```

and:

```text
AppLayout
├── Dashboard Header
├── Optional Menu
├── Page Content
└── Bottom Navigation
```

Layouts compose designs and pages but should not contain page-specific business logic.

---

### `layouts/designs/`

Contains reusable visual design variations.

Examples include:

```text
layouts/designs/
├── public/
│   ├── headers/
│   ├── navigation/
│   └── footers/
│
└── app/
    ├── headers/
    └── navigation/
```

A design is a reusable visual component.

For example:

```text
MinimalHeader
CenteredHeader
HamburgerHeader
DashboardHeader
AppBar
SidebarNavigation
BottomNavigation
SimpleFooter
ColumnsFooter
```

Designs should be independent from specific pages.

---

### `pages/`

Contains actual application screens.

Examples:

```text
pages/
├── landing/
├── auth/
│   ├── login/
│   └── register/
├── dashboard/
└── guest/
```

A page represents a route-level screen.

Pages can use:

* services from `core/`
* layouts
* designs
* shared UI components

Pages should not duplicate application infrastructure.

---

### `shared/ui/`

Contains small reusable UI primitives.

For example:

```text
shared/
└── ui/
    └── button/
```

These components should remain generic and reusable.

A button should not contain authentication logic, routing logic, or page-specific business rules.

---

# 2. Authentication Architecture

Authentication uses JWT tokens stored in **HttpOnly cookies**.

Angular never stores JWT access or refresh tokens in:

* `localStorage`
* `sessionStorage`
* application state
* component properties

The browser manages the cookies.

The main authentication pieces are:

```text
core/auth/
├── models/
└── services/
    ├── auth.service.ts
    ├── auth-state.ts
    └── csrf.service.ts
```

Supporting infrastructure includes:

```text
core/
├── guards/
├── interceptors/
├── initialization/
└── errors/
```

### Authentication flow

```text
Angular application
        │
        ▼
Application initializer
        │
        ▼
Initialize CSRF
        │
        ▼
User logs in
        │
        ▼
POST /api/auth/login/
        │
        ▼
Django authenticates user
        │
        ▼
Django sets HttpOnly JWT cookies
        │
        ▼
Browser stores cookies
        │
        ▼
Angular makes authenticated requests
```

The JWT itself is never exposed to Angular application code.

---

# 3. Cookie-Based JWT Approach

The project uses two JWT cookies:

```text
access_token
refresh_token
```

The access token is short-lived.

The refresh token has a longer lifetime and is used only to obtain new access credentials.

Both cookies are:

* HttpOnly
* configured with appropriate `Secure` settings
* configured with appropriate `SameSite` settings
* controlled by Django

### Cookie paths

The access cookie is available to the application:

```text
Path: /
```

The refresh cookie is intentionally restricted:

```text
Path: /api/auth/refresh/
```

This means the refresh token is not unnecessarily sent with normal API requests.

The browser automatically includes the appropriate cookies when requests use:

```ts
withCredentials: true
```

Angular does not manually read or attach the JWT.

---

## Login

```text
POST /api/auth/login/
        │
        ▼
Django validates credentials
        │
        ▼
Django creates access + refresh tokens
        │
        ▼
Django sets cookies
        │
        ▼
Angular receives successful response
```

---

## Authenticated Request

```text
Angular request
        │
        ▼
authInterceptor
        │
        ├── withCredentials: true
        │
        └── CSRF header when required
        │
        ▼
Django
        │
        ▼
CookieJWTAuthentication
        │
        ▼
Authenticated user
```

---

## Token Refresh

When an access token expires:

```text
Protected request
        │
        ▼
401 Unauthorized
        │
        ▼
Refresh request
        │
        ▼
POST /api/auth/refresh/
        │
        ▼
Django validates refresh token
        │
        ▼
New JWT cookies
        │
        ▼
Original request is retried
```

The refresh process is handled by the authentication infrastructure rather than by individual pages.

---

## Logout

Logout is performed through the backend.

```text
POST /api/auth/logout/
        │
        ▼
Django invalidates/blacklists refresh token
        │
        ▼
Django clears JWT cookies
        │
        ▼
User becomes unauthenticated
```

The frontend must not attempt to manually delete HttpOnly JWT cookies.

---

# 4. CSRF Protection

Cookie-based authentication introduces CSRF considerations because browsers automatically send cookies.

The application therefore uses Django's CSRF protection together with the Angular interceptor.

The application initializes a CSRF token through:

```text
GET /api/auth/csrf/
```

The CSRF token is then used for state-changing requests.

State-changing methods include:

```text
POST
PUT
PATCH
DELETE
```

The interceptor sends the token using:

```text
X-CSRFToken
```

GET requests do not require the CSRF header.

### Request flow

```text
Angular
   │
   ▼
authInterceptor
   │
   ├── withCredentials: true
   │
   └── X-CSRFToken for state-changing requests
   │
   ▼
Django
   │
   ▼
CSRF validation
   │
   ▼
Request processing
```

The server remains the authority for CSRF validation.

The frontend should never treat its own CSRF state as proof that a request is authorized.

---

# 5. Routing

Routing is defined in:

```text
src/app/app.routes.ts
```

The application currently separates public routes from the authenticated application area.

## Public routes

```text
/          → Landing
/login     → Login
/register  → Register
/guest     → Guest
```

These routes use:

```text
PublicLayout
```

---

## Authenticated application area

```text
/app
```

`/app` is the authenticated application area.

The Dashboard page is rendered inside this area.

```text
/app
  │
  ▼
AppLayout
  │
  ▼
Dashboard
```

The URL is intentionally `/app`.

The page itself is named `Dashboard`.

This distinction should be preserved:

> `/app` = authenticated application area
> `Dashboard` = page displayed inside the application area

---

## Development/Test routes

The starter also contains development/testing pages:

```text
/auth-test
/request-state-test
```

These are useful while developing or verifying infrastructure.

They can be removed or replaced when a project built from this starter no longer needs them.

---

## Wildcard route

Unknown routes are redirected to the public landing page.

```text
/** → /
```

This prevents users from reaching an undefined route.

---

# 6. Route Guards

Protected routes use the authentication guard:

```text
core/guards/auth-guard.ts
```

The guard protects the authenticated application area.

Conceptually:

```text
User visits /app
        │
        ▼
authGuard
        │
        ▼
Is the user authenticated?
      /   \
    yes    no
     │      │
     ▼      ▼
Dashboard  Login
```

The guard should use the application's authentication state rather than attempting to inspect JWT cookies directly.

This is important because JWT cookies are HttpOnly and therefore intentionally inaccessible to JavaScript.

### Important rule

Do not add authentication checks separately to every page.

Use the route guard at the appropriate protected route level.

---

# 7. HTTP Interceptors

The authentication interceptor is located at:

```text
core/interceptors/auth.interceptor.ts
```

The interceptor provides common HTTP behavior for the application.

Its responsibilities include:

* sending credentials with API requests
* adding the CSRF token when required
* participating in authentication/refresh handling

The goal is to keep authentication behavior out of individual pages.

For example, a page should be able to simply call:

```ts
this.authService.login(...)
```

rather than manually managing:

* cookies
* JWTs
* CSRF headers
* refresh requests

This keeps pages focused on UI and user interaction.

---

# 8. Layouts

Layouts compose the major visual structure of the application.

The starter has two primary layouts:

```text
layouts/
├── public-layout/
└── app-layout/
```

---

## PublicLayout

Used for public pages.

Current structure:

```text
PublicLayout
├── MinimalHeader
├── RouterOutlet
└── SimpleFooter
```

The layout owns the overall public-page structure.

Individual pages provide the content rendered inside the router outlet.

For example:

```text
/
├── PublicLayout
│   ├── MinimalHeader
│   ├── Landing
│   └── SimpleFooter
```

---

## AppLayout

Used for authenticated application pages.

Current structure:

```text
AppLayout
├── DashboardHeader
├── Optional Menu
├── RouterOutlet
└── BottomNavigation
```

The layout controls application-level composition.

For example:

```text
/app
├── AppLayout
│   ├── DashboardHeader
│   ├── Menu
│   ├── Dashboard
│   └── BottomNavigation
```

The menu belongs to the layout because it is application-level navigation, not part of the Dashboard page itself.

---

# 9. Designs

Designs are reusable visual components located under:

```text
layouts/designs/
```

The starter currently contains 15 designs.

## Public designs

### Headers

```text
1. Minimal Header
2. Centered Header
3. Hamburger Header
4. Public App Bar
```

### Navigation

```text
5. Public Bottom Navigation
6. Public Right-Side Navigation
7. Public Left-Side Navigation
8. Public Left-Side Icon Navigation
```

### Footers

```text
9. Simple Footer
10. Columns Footer
```

---

## Authenticated designs

### Headers

```text
11. Simple App Header
12. Dashboard Header
13. App Bar
```

### Navigation

```text
14. Sidebar Navigation
15. App Bottom Navigation
```

---

## Design responsibility

A design should focus on presentation and interaction that is reusable across multiple pages.

For example:

```text
DashboardHeader
```

knows how to display a dashboard header and emit a menu event.

It should not know:

* which application page is currently open
* how authentication works
* how logout is implemented
* what the application's business rules are

The parent layout decides what to do with the event.

This keeps designs reusable.

---

# 10. Pages

Pages are route-level screens.

They are located under:

```text
src/app/pages/
```

Current structure:

```text
pages/
├── auth/
│   ├── login/
│   └── register/
├── dashboard/
├── guest/
├── landing/
├── auth-test/
└── request-state-test/
```

### Authentication pages

```text
pages/auth/
├── login/
└── register/
```

These are public authentication screens.

---

### Landing page

```text
pages/landing/
```

The landing page is the public entry point:

```text
/
```

---

### Guest page

```text
pages/guest/
```

The starter provides the guest entry point.

Actual guest functionality can be implemented by the application built from this starter.

---

### Dashboard page

```text
pages/dashboard/
```

The Dashboard is the authenticated application landing screen.

It is displayed through:

```text
/app
    ↓
AppLayout
    ↓
Dashboard
```

The folder is named `dashboard`, not `app`, because the page represents the Dashboard while `/app` represents the authenticated application area.

---

# 11. How to Add a New Page

When adding a new page, follow these steps.

## Step 1 — Create the page folder

For example, to create a Profile page:

```text
pages/
└── profile/
```

Create:

```text
profile/
├── profile.ts
├── profile.html
├── profile.css
└── profile.spec.ts
```

---

## Step 2 — Create the component

The component should represent the page itself.

For example:

```ts
@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {}
```

Keep page-specific UI inside the page.

---

## Step 3 — Add the route

Import the page into:

```text
app.routes.ts
```

Then add the appropriate route.

For a protected page:

```ts
{
  path: 'profile',
  component: Profile,
}
```

If the route belongs to the authenticated application area, place it inside `AppLayout`'s children.

---

## Step 4 — Decide which layout owns the page

Public page:

```text
PublicLayout
    └── Page
```

Authenticated page:

```text
AppLayout
    └── Page
```

Do not create a new layout unless the page genuinely requires a different overall composition.

---

## Step 5 — Add navigation

If users need to reach the page through application navigation, add the appropriate link to the relevant navigation design or layout.

Do not add navigation to a page component merely because the page exists.

Navigation belongs to the appropriate navigation component or layout.

---

## Step 6 — Add tests

Create or update the page's component test.

At minimum, verify that the component can be created successfully.

Add more tests when the page contains meaningful behavior.

---

## Step 7 — Test the route

Verify:

* direct navigation
* navigation through links
* correct layout
* authentication requirements
* mobile/desktop behavior where relevant
* browser console for errors

---

# 12. How to Add a New Design

A new design belongs under:

```text
layouts/designs/
```

First determine whether it belongs to:

```text
layouts/designs/public/
```

or:

```text
layouts/designs/app/
```

---

## Step 1 — Decide what the design represents

Examples:

```text
Header
Navigation
Footer
App Bar
```

Use a descriptive name based on its visual/structural purpose.

---

## Step 2 — Create the design folder

For example:

```text
layouts/designs/app/headers/profile/profile-header/
```

Create:

```text
profile-header/
├── profile-header.ts
├── profile-header.html
├── profile-header.css
└── profile-header.spec.ts
```

---

## Step 3 — Keep the design reusable

The design should not contain page-specific business logic.

Prefer inputs and outputs when the parent needs to customize behavior.

For example:

```ts
readonly title = input('Profile');
readonly menuToggle = output<void>();
```

The design emits an event.

The parent decides what that event means.

---

## Step 4 — Add tests

At minimum, verify:

* component creation
* default inputs
* important outputs/events
* important interactive behavior

---

## Step 5 — Use the design from a layout

Import the design into the appropriate layout.

For example:

```text
AppLayout
    └── ProfileHeader
```

The layout determines how the design fits into the application's overall composition.

---

# 13. Architecture Rules

These rules should be followed when extending the starter.

### Rule 1 — Keep infrastructure in `core/`

Authentication, guards, interceptors, configuration, errors, initialization, and application-wide state belong in `core/`.

---

### Rule 2 — Keep pages in `pages/`

A route-level screen belongs in `pages/`.

Do not create a separate `features/` structure unless the application genuinely requires a feature-based architecture.

This starter intentionally uses `pages/` for simplicity.

---

### Rule 3 — Keep layouts responsible for composition

Layouts decide which reusable designs and navigation structures appear around page content.

They should not become repositories for page-specific business logic.

---

### Rule 4 — Keep designs reusable

Designs should not depend on a specific page.

A design should be usable by multiple layouts/pages where appropriate.

---

### Rule 5 — Keep shared UI generic

Components under:

```text
shared/ui/
```

should be small, reusable UI primitives.

They should not contain application-specific business rules.

---

### Rule 6 — Do not expose JWTs to Angular

Never store JWT tokens in:

```text
localStorage
sessionStorage
```

Never read HttpOnly JWT cookies from application code.

Authentication remains cookie-based.

---

### Rule 7 — Let the server remain authoritative

The frontend provides the user interface and sends requests.

The backend remains responsible for authoritative:

* authentication
* authorization
* validation
* CSRF validation
* token validation
* security decisions

Frontend checks improve UX but must not be treated as security boundaries.

---

### Rule 8 — Centralize authentication behavior

Do not implement token refresh, credential handling, or CSRF handling independently inside pages.

Use:

```text
AuthService
AuthState
CsrfService
authInterceptor
authGuard
```

for their respective responsibilities.

---

### Rule 9 — Prefer composition over duplication

Before creating another header, navigation, footer, or layout, check whether an existing design can be reused or extended appropriately.

---

### Rule 10 — Avoid unnecessary abstraction

This starter intentionally favors a small number of clear architectural boundaries over excessive configuration or abstraction.

If a simple component solves the problem, use a simple component.

---

# 14. Architecture at a Glance

The overall relationship is:

```text
                         ┌───────────────┐
                         │     core/     │
                         │               │
                         │ Auth          │
                         │ Guards        │
                         │ Interceptors  │
                         │ Errors        │
                         │ Config        │
                         └───────┬───────┘
                                 │
                                 │
              ┌──────────────────┴──────────────────┐
              │                                     │
              ▼                                     ▼
       ┌─────────────┐                       ┌─────────────┐
       │   Layouts   │                       │    Pages    │
       │             │                       │             │
       │ Public      │◄──── compose ───────►│ Landing     │
       │ App         │                       │ Login       │
       │             │                       │ Register    │
       └──────┬──────┘                       │ Dashboard   │
              │                              │ Guest       │
              │                              └─────────────┘
              │
              ▼
       ┌─────────────┐
       │   Designs   │
       │             │
       │ Headers     │
       │ Navigation  │
       │ Footers     │
       └──────┬──────┘
              │
              ▼
       ┌─────────────┐
       │ shared/ui/  │
       │             │
       │ Button      │
       │ Other UI    │
       └─────────────┘
```

The key idea is:

```text
Core
  ↓
Infrastructure

Layouts
  ↓
Composition

Designs
  ↓
Reusable visual structures

Pages
  ↓
Actual screens

Shared UI
  ↓
Small reusable primitives
```

This separation keeps the starter reusable while avoiding unnecessary complexity.
