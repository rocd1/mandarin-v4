# PublicLayout — Reusable Public Page Layout

## What is PublicLayout?

`PublicLayout` is the shared visual structure used by the application's public-facing pages.

Instead of having every public page create its own header, main container, and footer, these shared elements are placed in one reusable layout.

Current public pages include:

* Landing
* Login
* Register
* Guest

The layout is responsible for the **shared structure**, while each page remains responsible for its own content and behavior.

---

## Why use a layout?

Without a layout, each page could contain its own:

```text
Header
Page Content
Footer
```

This creates duplication.

If the header needs to change later, we would potentially need to update multiple pages.

With `PublicLayout`, the structure becomes:

```text
PublicLayout
├── Header
├── Page Content
└── Footer
```

The individual pages only need to provide their own content.

This gives the starter a cleaner and more reusable architecture.

---

## Current Project Structure

The layout is located at:

```text
src/app/layouts/public-layout/
├── public-layout.ts
├── public-layout.html
└── public-layout.css
```

The related public pages remain under:

```text
src/app/pages/
├── landing/
├── auth/
│   ├── login/
│   └── register/
└── guest/
```

This separation is intentional.

### `layouts/`

Contains reusable visual structures.

### `pages/`

Contains actual application screens and their page-specific behavior.

---

## PublicLayout Component

The component itself is intentionally simple:

```ts
import { Component } from '@angular/core';

import {
  RouterLink,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-public-layout',
  imports: [
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {}
```

There is currently no application logic inside `PublicLayout`.

This is intentional.

The layout should not be responsible for:

* authentication
* API requests
* form validation
* login behavior
* registration behavior
* application state
* page-specific business logic

Its responsibility is primarily shared presentation and structure.

---

## PublicLayout Template

The current template is:

```html
<div class="public-layout">
  <header class="site-header">
    <a routerLink="/" class="brand">
      Project App Starter
    </a>
  </header>

  <main class="site-main">
    <router-outlet />
  </main>

  <footer class="site-footer">
    <p>Project App Starter</p>
  </footer>
</div>
```

The important part is the nested:

```html
<router-outlet />
```

This allows Angular to render the current public page inside the layout.

---

## Nested Routing

The public routes are now grouped under `PublicLayout`.

Conceptually:

```text
App
│
└── PublicLayout
    │
    ├── /
    │   └── Landing
    │
    ├── /login
    │   └── Login
    │
    ├── /register
    │   └── Register
    │
    └── /guest
        └── Guest
```

The outer router outlet belongs to the root `App` component.

```text
App
└── <router-outlet />
```

The `PublicLayout` then provides another router outlet for its child pages.

```text
PublicLayout
└── <router-outlet />
```

Therefore the actual rendering hierarchy becomes:

```text
App
└── RouterOutlet
    └── PublicLayout
        ├── Header
        ├── RouterOutlet
        │   └── Public Page
        └── Footer
```

For example, when navigating to:

```text
/login
```

Angular renders:

```text
App
└── PublicLayout
    ├── Header
    ├── Login
    └── Footer
```

When navigating to:

```text
/register
```

the layout remains the same, but the child page changes:

```text
App
└── PublicLayout
    ├── Header
    ├── Register
    └── Footer
```

---

# Responsive Design

The first version of `PublicLayout` uses a simple responsive design.

The desktop layout provides more horizontal spacing, while the mobile layout reduces padding so the content has more usable screen space.

## Desktop

```text
┌───────────────────────────────────────────────┐
│ Project App Starter                           │
├───────────────────────────────────────────────┤
│                                               │
│        ┌───────────────────────────┐          │
│        │                           │          │
│        │       Page content        │          │
│        │                           │          │
│        └───────────────────────────┘          │
│                                               │
├───────────────────────────────────────────────┤
│ Project App Starter                           │
└───────────────────────────────────────────────┘
```

The page content is limited to `960px`, while the header and footer span the viewport.

The main content uses:

```css
.site-main {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;
}
```

This provides a readable content width on larger screens.

---

## Mobile

```text
┌──────────────────────┐
│ Project App Starter  │
├──────────────────────┤
│                      │
│   Page content       │
│                      │
├──────────────────────┤
│ Project App Starter  │
└──────────────────────┘
```

At screen widths below `640px`, the layout reduces the horizontal padding:

```css
@media (max-width: 640px) {
  .site-main {
    padding: 1rem;
  }
}
```

The header and footer also reduce their horizontal padding from:

```text
2rem
```

to:

```text
1rem
```

This keeps the layout comfortable on smaller screens without requiring horizontal scrolling.

---

# Current Visual Theme

The initial public layout uses a simple neutral theme:

```text
Background: #f9fafb
Header:     #ffffff
Footer:     #f3f4f6
Text:       #111827
Border:     #e5e7eb
Brand:      #1f2937
Hover:      #2563eb
```

The font currently uses:

```css
font-family: system-ui, sans-serif;
```

This gives the starter a clean, modern system-font appearance without requiring an external font dependency.

---

# Why the Header Does Not Have Navigation Yet

The initial `PublicLayout` intentionally does **not** include a navigation menu.

For example, we are not currently adding:

```text
Project App Starter       Home  About  Contact  Sign In
```

or a mobile menu such as:

```text
Project App Starter                         ☰
```

This is deliberate.

Navigation is a separate shared concern from the basic layout structure.

We first want to establish:

```text
Layout
├── Header
├── Page
└── Footer
```

Once the basic layout architecture is stable, we can design the reusable navigation properly.

This avoids prematurely building a navigation system that may need to be redesigned later.

---

# Architecture Principle

The current architecture is:

```text
App
│
└── PublicLayout
    │
    ├── Header
    │
    ├── RouterOutlet
    │   └── Public Page
    │
    └── Footer
```

The responsibilities are separated:

```text
App
└── Application root

PublicLayout
├── Shared public structure
├── Header
├── Footer
└── Public page outlet

Pages
├── Landing
├── Login
├── Register
└── Guest
```

The page itself should not need to know that it is being rendered inside `PublicLayout`.

For example:

```text
Login
├── Login form
├── Form validation
├── Authentication request
├── Request state
└── Authentication state
```

while:

```text
PublicLayout
├── Header
├── Main content area
└── Footer
```

This separation keeps the application easier to maintain and makes the layout reusable.

---

# What We Tested

After creating `PublicLayout`, we verified:

* Angular compiles successfully.
* The header appears.
* The footer appears.
* `/` continues to load Landing.
* `/login` continues to load Login.
* `/register` continues to load Register.
* `/guest` continues to load Guest.
* Nested routing works.
* The existing page behavior remains intact.
* The responsive layout works at smaller screen sizes.
* The selected colors and system font work correctly.

The authentication behavior was not moved into the layout and remains owned by the appropriate authentication services and pages.

---

# Important Lesson

A **page is not the same thing as a layout**.

A page represents an actual screen:

```text
Landing
Login
Register
Dashboard
Profile
Settings
```

A layout represents the reusable structure surrounding those screens:

```text
PublicLayout
AppLayout
```

Therefore:

```text
core
```

contains reusable application infrastructure,

```text
layouts
```

contains reusable visual structures,

and:

```text
pages
```

contains actual screens.

A useful mental model is:

```text
core → how the application works

layouts → how groups of pages are structured

pages → what the user sees and does
```

---

# Next Step

`PublicLayout` is now established as the reusable public shell.

The next step is to integrate the existing public pages one at a time:

```text
5.3 Landing       ← next
5.4 Login
5.5 Register
5.6 Guest
```

We will **not rewrite their existing behavior**.

We will simply verify that each page works correctly inside the new `PublicLayout`.

After the public pages are stable, we will create:

```text
AppLayout
```

for authenticated application screens.

