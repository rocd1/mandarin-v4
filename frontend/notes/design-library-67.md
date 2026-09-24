# Design Library

This directory contains the reusable visual design components used by the Angular application.

The design library is intentionally separate from application pages and layouts.

Designs provide reusable **presentation and interaction patterns**, while layouts compose those designs into complete application structures.

---

## Purpose

The design library provides multiple reusable visual patterns for:

* public-facing pages
* authenticated application pages
* headers
* navigation
* footers

The designs are intentionally small and independent so they can be tested and reused without coupling them to application-specific business logic.

---

## Architecture

```text
src/app/
│
├── layouts/
│   ├── public-layout/
│   ├── app-layout/
│   │
│   └── designs/
│       ├── public/
│       └── app/
│
├── pages/
└── shared/
```

### Layouts

Layouts compose the application structure.

Examples:

```text
PublicLayout
├── Public Header
├── Router Outlet
└── Public Footer
```

```text
AppLayout
├── App Header
├── Router Outlet
└── App Navigation
```

### Designs

Designs are reusable visual implementations of individual UI patterns.

Examples:

```text
Minimal Header
Simple App Header
Dashboard Header
Sidebar Navigation
Bottom Navigation
```

### Pages

Pages contain application-specific content and behavior.

Examples:

```text
Landing
Login
Register
Dashboard
Learning
Vocabulary
Quiz
Profile
```

---

# Design Library Rules

## 1. Designs are reusable

A design should be usable by more than one page or layout.

Avoid building a design specifically around one application's business requirement when the behavior can remain generic.

---

## 2. Designs do not contain business logic

Design components should not contain application-specific business rules.

For example, a navigation design should not:

* load vocabulary data
* perform authentication
* manage quiz state
* call application APIs
* determine user permissions

Those responsibilities belong elsewhere.

---

## 3. Designs may handle presentation interaction

Small UI interactions are appropriate inside a design.

Examples:

* opening a menu
* emitting a button event
* toggling a visual state
* displaying an active navigation item

The parent layout or application decides what the interaction means.

For example:

```ts
readonly menuToggle = output<void>();
```

The header emits the event, while the parent layout decides what happens.

---

## 4. Authentication remains outside the design library

The design library does not manage authentication.

Authentication is handled by the application's authentication infrastructure:

```text
core/auth/
core/guards/
core/interceptors/
```

The design library can contain navigation links for authenticated areas, but it does not determine whether a user is authenticated.

Route protection remains the responsibility of the router and authentication guard.

---

## 5. Designs should remain replaceable

A design should be replaceable without requiring changes to the page's business logic.

For example, an authenticated application may use:

```text
Simple App Header
```

or:

```text
Dashboard Header
```

without changing the underlying dashboard functionality.

---

# Public Designs

The public design library contains designs intended for visitors and unauthenticated pages.

```text
designs/public/
```

## #1 Minimal Header

Location:

```text
public/headers/minimal/
```

Purpose:

A simple standard website header suitable for general public pages.

---

## #2 Centered Header

Location:

```text
public/headers/centered/
```

Purpose:

A centered-brand public header with navigation links.

---

## #3 Hamburger Header

Location:

```text
public/headers/hamburger/
```

Purpose:

A compact public header using a hamburger navigation pattern.

---

## #4 Public App Bar

Location:

```text
public/headers/app-bar/
```

Purpose:

A compact public-facing application bar with navigation and authentication access.

---

## #5 Public Bottom Navigation

Location:

```text
public/navigation/bottom/
```

Purpose:

A mobile-oriented public navigation pattern with icons and labels.

---

## #6 Public Right-Side Navigation

Location:

```text
public/navigation/right-side/
```

Purpose:

A vertical navigation pattern positioned on the right side of the page.

The design uses a translucent surface with backdrop blur.

---

## #7 Public Left-Side Navigation

Location:

```text
public/navigation/left-side/
```

Purpose:

A vertical navigation pattern positioned on the left side of the page.

The design uses a translucent surface with backdrop blur.

---

## #8 Public Left-Side Icon Navigation

Location:

```text
public/navigation/left-side-icon/
```

Purpose:

A compact left-side navigation pattern using icons as the primary navigation indicators.

---

## #9 Simple Footer

Location:

```text
public/footers/simple/
```

Purpose:

A simple public footer suitable for basic pages.

---

## #10 Columns Footer

Location:

```text
public/footers/columns/
```

Purpose:

A multi-column public footer suitable for applications with several groups of links.

---

# Authenticated App Designs

Authenticated designs are located under:

```text
designs/app/
```

These designs are intended for the logged-in application experience.

The authenticated application uses **Dashboard** as its primary application starting point.

```text
/app
```

The public landing page remains separate:

```text
/
```

Therefore:

```text
Public Home      → /
Authenticated    → /app
Dashboard
```

Authenticated navigation should not use the public landing page as its Home destination.

---

## #11 Simple App Header

Location:

```text
app/headers/simple/simple-header/
```

Purpose:

A minimal authenticated application header.

Structure:

```text
┌──────────────────────────────────────────────┐
│ PROJECT APP                            Profile│
└──────────────────────────────────────────────┘
```

Characteristics:

* application branding
* profile access
* simple layout
* no hamburger menu
* no search
* no application-specific logic

---

## #12 Dashboard Header

Location:

```text
app/headers/dashboard/dashboard-header/
```

Purpose:

A dashboard-oriented header with a navigation-menu event and profile access.

Structure:

```text
┌──────────────────────────────────────────────┐
│ ☰   Dashboard                         Profile│
└──────────────────────────────────────────────┘
```

The menu button emits an event rather than implementing application navigation itself.

This allows the parent layout to decide how the menu should behave.


```
For dashboard header setup

The flow should be:

DashboardHeader
    ↓ menuToggle
AppLayout
    ↓
show/hide menu
    ↓
Sidebar/menu items
1. app-layout.html

Change it to:
----------------------------------------------------------
app-layout.html
<div class="app-layout">
  <app-dashboard-header
    (menuToggle)="toggleMenu()"
  />

  @if (isMenuOpen()) {
    <nav
      class="menu-panel"
      aria-label="Secondary navigation"
    >
      <a routerLink="/app">Settings</a>
      <a routerLink="/app">Contact Us</a>
      <a routerLink="/app">Community</a>

      <div class="menu-divider"></div>

      <a routerLink="/app">Logout</a>
    </nav>
  }

  <main class="app-main">
    <router-outlet />
  </main>

</div>
-----------------------------------------------------------

Notice this part:

(menuToggle)="toggleMenu()"

That's the connection between the hamburger button and the parent layout.

2. app-layout.ts

Then your AppLayout needs to hold the menu state:

-------------------------------------------------------------
app-layout.ts
import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { DashboardHeader } from '../designs/app/headers/dashboard/dashboard-header/dashboard-header';


@Component({
  selector: 'app-app-layout',
  imports: [
    RouterLink,
    RouterOutlet,
    DashboardHeader,
    
  ],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
})
export class AppLayout {
  protected readonly isMenuOpen = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }
}
-----------------------------------------------------------

So when the user clicks:

☰

DashboardHeader does:

this.menuToggle.emit();

which triggers:

(menuToggle)="toggleMenu()"

which changes:

isMenuOpen

and Angular displays:

@if (isMenuOpen()) {
    ...
}
3. The important distinction

Your DashboardHeader contains the hamburger button:

<button
  type="button"
  class="menu-button"
  aria-label="Open navigation menu"
  (click)="toggleMenu()"
>
  ☰
</button>

But it doesn't contain the menu items.

Your AppLayout owns the menu:

AppLayout
├── DashboardHeader
│   └── ☰ hamburger
│
├── Menu
│   ├── Settings
│   ├── Contact Us
│   ├── Community
│   └── Logout
│
├── router-outlet
│
└── BottomNavigation

That's actually a good separation for your design library: DashboardHeader is reusable, while the application's actual menu belongs to the layout.

```


---

## #13 App Bar

Location:

```text
app/headers/app-bar/
```

Purpose:

A compact authenticated application bar.

Structure:

```text
┌──────────────────────────────────────────────┐
│ ☰             PROJECT APP               🔍   │
└──────────────────────────────────────────────┘
```

This design supports:

* menu interaction
* application title
* search interaction

The actual menu and search behavior belong to the parent application layout.

---

## #14 Sidebar Navigation

Location:

```text
app/navigation/sidebar/
```

Purpose:

A persistent authenticated navigation pattern suitable for desktop layouts.

Structure:

```text
┌──────────────────┐
│ PROJECT APP      │
│                  │
│ Dashboard        │
│ Learning         │
│ Vocabulary       │
│ Quiz             │
│ Profile          │
└──────────────────┘
```

The navigation currently provides placeholder application destinations while the actual authenticated application pages are being built.

Routes can be updated when the corresponding pages are created.

---

## #15 App Bottom Navigation

Location:

```text
app/navigation/bottom/
```

Purpose:

A mobile-oriented authenticated navigation pattern.

Current conceptual navigation:

```text
Dashboard | Learning | New | Quiz | Profile
```

The primary authenticated destination is:

```text
Dashboard → /app
```

The remaining destinations can be connected to their final application routes as those pages are implemented.

---

# Public vs Authenticated Navigation

The application intentionally separates public and authenticated navigation.

## Public

```text
/
└── Landing Page
    └── Public Navigation
        └── Home → /
```

## Authenticated

```text
/app
└── Dashboard
    └── App Navigation
        └── Dashboard → /app
```

This prevents authenticated users from confusing the public landing page with their authenticated application home.

The two concepts are intentionally different:

```text
Home
└── Public landing experience

Dashboard
└── Authenticated application starting point
```

---

# Current Design Inventory

| #  | Category | Design                    | Status   |
| -- | -------- | ------------------------- | -------- |
| 1  | Public   | Minimal Header            | Complete |
| 2  | Public   | Centered Header           | Complete |
| 3  | Public   | Hamburger Header          | Complete |
| 4  | Public   | Public App Bar            | Complete |
| 5  | Public   | Public Bottom Navigation  | Complete |
| 6  | Public   | Right-Side Navigation     | Complete |
| 7  | Public   | Left-Side Navigation      | Complete |
| 8  | Public   | Left-Side Icon Navigation | Complete |
| 9  | Public   | Simple Footer             | Complete |
| 10 | Public   | Columns Footer            | Complete |
| 11 | App      | Simple App Header         | Complete |
| 12 | App      | Dashboard Header          | Complete |
| 13 | App      | App Bar                   | Complete |
| 14 | App      | Sidebar Navigation        | Complete |
| 15 | App      | App Bottom Navigation     | Complete |

**Total: 15 reusable designs**

---

# Design vs Layout vs Page

Keep these responsibilities separate.

```text
Design
  ↓
Reusable visual component

Layout
  ↓
Composes designs into an application structure

Page
  ↓
Contains application-specific content and behavior
```

For example:

```text
AppLayout
│
├── DashboardHeader
│
├── RouterOutlet
│
└── BottomNavigation
```

The routed page might then be:

```text
Dashboard
```

This allows the same design to be used with different pages or layouts without duplicating UI code.

---

# Testing

Each design should have its own Angular component test where appropriate.

Example:

```bash
ng test
```

Visual testing can be performed by temporarily placing a design into the relevant layout.

For example:

```text
/app
└── AppLayout
    ├── SimpleAppHeader
    ├── Page Content
    └── BottomNavigation
```

A design can then be replaced with another design to compare the visual layout without changing the application's underlying page logic.

---

# Future Changes

The design library is considered complete for the current starter architecture.

New designs should only be added when there is a clear reusable UI requirement.

Application-specific components should normally be placed in the appropriate page or shared UI area instead of continuously expanding this design library.

The current library contains:

```text
10 Public Designs
+
5 Authenticated App Designs
=
15 Total Designs
```

This provides a stable visual foundation for the next stage of application development.
