# Landing Page — Integrating a Page with PublicLayout

## Purpose

The Landing page is the public entry point of the starter application.

It introduces the application and provides navigation to the main public entry points:

* Sign In
* Create Account
* Continue as Guest

The Landing page is a **page**, not a layout.

Its responsibility is to provide landing-specific content and actions.

---

## Architecture

After introducing `PublicLayout`, the Landing page is rendered inside the public layout:

```text
App
│
└── PublicLayout
    │
    ├── Header
    │
    ├── RouterOutlet
    │   └── Landing
    │       ├── Eyebrow
    │       ├── Heading
    │       ├── Subtitle
    │       └── Actions
    │
    └── Footer
```

This creates a clear separation of responsibilities.

### PublicLayout

Responsible for:

* shared header
* shared footer
* public page container
* responsive public-page structure
* nested router outlet

### Landing

Responsible for:

* hero content
* landing-page messaging
* Sign In link
* Create Account link
* Guest link
* landing-specific styling

The Landing page does not need to know that it is being rendered inside `PublicLayout`.

---

## Landing Component

The Landing component remains intentionally simple:

```ts
import { Component } from '@angular/core';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {}
```

There is currently no TypeScript logic because the page does not require application state or API interaction.

This is appropriate for a simple static landing page.

---

## Landing Template

The page contains a centered hero section:

```html
<main class="landing-page">
  <section class="hero">
    <p class="eyebrow">PROJECT APP STARTER</p>

    <h1>Build something great.</h1>

    <p class="subtitle">
      A secure, reusable application starter built with Django,
      Django REST Framework, and Angular.
    </p>

    <div class="actions">
      <a routerLink="/login" class="button primary">
        Sign In
      </a>

      <a routerLink="/register" class="button secondary">
        Create Account
      </a>

      <a routerLink="/guest" class="guest-link">
        Continue as Guest
      </a>
    </div>
  </section>
</main>
```

The page uses Angular's `RouterLink` directive rather than normal browser navigation.

For example:

```html
<a routerLink="/login">
```

allows Angular to navigate to the Login route without performing a full browser page reload.

---

# Routing

The Landing page is now a child route of `PublicLayout`:

```ts
{
  path: '',
  component: PublicLayout,
  children: [
    {
      path: '',
      component: Landing,
    },
    // other public pages...
  ],
}
```

Therefore:

```text
/ → PublicLayout → Landing
```

The same public layout will eventually contain:

```text
/login    → Login
/register → Register
/guest    → Guest
```

This avoids duplicating the shared header and footer across each public page.

---

# Layout vs Page

This integration demonstrates an important Angular architecture principle.

A layout provides shared structure:

```text
PublicLayout
├── Header
├── RouterOutlet
└── Footer
```

A page provides specific content:

```text
Landing
└── Hero
    ├── Heading
    ├── Description
    └── Actions
```

We should avoid putting Landing-specific content into `PublicLayout`.

For example, these belong to Landing:

```text
Build something great.
Sign In
Create Account
Continue as Guest
```

while these belong to PublicLayout:

```text
Header
Footer
Main content area
```

This separation allows the same layout to be reused by Login, Register, and Guest.

---

# Responsive Design

The Landing page is designed to work within the responsive `PublicLayout`.

The hero uses:

```css
.hero {
  width: 100%;
  max-width: 720px;
  text-align: center;
}
```

This prevents the text from becoming excessively wide on large screens.

The heading uses:

```css
h1 {
  font-size: clamp(2.5rem, 7vw, 4.5rem);
}
```

`clamp()` allows the heading to scale between a minimum and maximum size depending on the viewport width.

The action buttons also adapt to smaller screens:

```css
.button {
  width: min(100%, 280px);
}
```

This means the buttons can use the available width on small screens without growing beyond `280px`.

---

# Avoiding Nested `100vh` Problems

Before integrating the Landing page, it used:

```css
.landing-page {
  min-height: 100vh;
}
```

This made sense when Landing was effectively responsible for the whole viewport.

After introducing `PublicLayout`, the layout itself owns the viewport height:

```css
.public-layout {
  min-height: 100vh;
}
```

Therefore Landing was changed to:

```css
.landing-page {
  min-height: 100%;
}
```

This is important because the page now exists inside:

```text
PublicLayout
├── Header
├── Main
│   └── Landing
└── Footer
```

Using another `100vh` inside Landing could make the page's height equal to the entire viewport **in addition to** the header and footer, potentially creating unnecessary vertical scrolling.

The layout should own the overall viewport height.

The page should manage its own content within that space.

---

# Responsive Spacing

The Landing page uses smaller spacing on mobile:

```css
@media (max-width: 640px) {
  .landing-page {
    padding: 1.5rem 0;
  }

  .subtitle {
    font-size: 1rem;
  }

  .actions {
    margin-top: 2rem;
  }
}
```

This works together with the responsive spacing provided by `PublicLayout`.

The layout controls the overall page container padding, while Landing controls its own hero-specific spacing.

---

# Testing

After integrating Landing with `PublicLayout`, the following were verified:

### Layout

* Header appears.
* Footer appears.
* Landing content appears between them.
* No unnecessary vertical scrolling occurs.
* Desktop layout looks correct.
* Mobile layout remains usable.

### Navigation

The Landing actions were tested:

```text
Sign In
    ↓
/login
```

```text
Create Account
    ↓
/register
```

```text
Continue as Guest
    ↓
/guest
```

All routes continue to work.

### Existing behavior

No authentication logic was moved into the Landing page or PublicLayout.

The existing Login, Register, and Guest functionality remains independent.

---

# Important Lesson

When introducing layouts into an existing Angular application, we do not need to rewrite the pages.

Instead, we can gradually introduce a shared structure:

```text
Before:

Landing
Login
Register
Guest
```

becomes:

```text
After:

PublicLayout
│
├── Landing
├── Login
├── Register
└── Guest
```

The pages continue to own their own behavior.

The layout owns shared structure.

This allows us to improve the application's architecture without disturbing already-tested functionality.

---

# Current Architecture

The starter now follows this general separation:

```text
src/app/
│
├── core/
│   └── Reusable application infrastructure
│
├── layouts/
│   └── PublicLayout
│       └── Shared public structure
│
└── pages/
    ├── landing/
    │   └── Landing page
    │
    ├── auth/
    │   ├── login/
    │   └── register/
    │
    └── guest/
        └── Guest page
```

The architectural rule is:

```text
core    → how the application works

layouts → how groups of pages are structured

pages   → what the user sees and does
```

---

# Checkpoint

Landing page integration is complete.

Completed:

```text
5.1 Create PublicLayout       ✅
5.2 Test PublicLayout        ✅
5.3 Integrate Landing        ✅
```

The next step is:

```text
5.4 Integrate Login
```

Login requires extra care because it already has working:

* Reactive Forms
* authentication API call
* `/me/` request
* `RequestState`
* API error normalization
* `AuthStateService`
* navigation to `/app`

The layout change should not alter any of those responsibilities.
