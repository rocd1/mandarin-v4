# 5.9.2 — Reusable Button Component

## Overview

The Button component is the first reusable UI primitive extracted from the existing application pages.

The goal is **not to redesign the application's buttons**. The existing button appearance was already acceptable.

Instead, the goal is to create a single reusable component that provides:

* consistent button styling
* consistent interaction states
* native HTML button behavior
* reusable button variants
* a single place to maintain common button UI

This establishes the foundation for a reusable UI system without over-engineering the starter.

---

## Why Create a Button Component?

Before extracting the component, buttons were defined directly inside individual pages.

For example:

```html
<button type="submit">
  Sign In
</button>
```

and other pages had their own buttons with their own styling.

This works perfectly well for a small application.

However, as the application grows, repeated button styling can become difficult to maintain.

For example:

```text
Login
  └── button styling

Register
  └── button styling

Profile
  └── button styling

Settings
  └── button styling

Dashboard
  └── button styling
```

Over time, these styles can accidentally become inconsistent.

A reusable Button component changes this to:

```text
                    Button
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
      Login        Register       Profile
        │             │             │
        └─────────────┴─────────────┘
                      │
                shared styling
```

If the common button design needs to change later, it can be changed in one place.

---

# Important Design Principle

The Button component is a **UI primitive**, not an application service.

It should know about:

* button appearance
* button variants
* native button behavior
* button interaction states

It should **not** know about:

* authentication
* routing
* API requests
* forms
* business logic
* application-specific actions

For example, the following would be inappropriate:

```ts
// ❌ Do not put application logic in Button

login(): void {
  this.authService.login(...);
}
```

Instead, the page remains responsible for the action:

```text
Login Page
    │
    ├── handles form
    ├── calls AuthService
    └── decides what happens after login

Button
    │
    └── displays the button and handles common UI
```

This separation keeps the Button reusable.

---

# Component Location

The Button component lives under:

```text
src/app/shared/ui/button/
```

Current structure:

```text
shared/
└── ui/
    └── button/
        ├── button.ts
        ├── button.html
        ├── button.css
        └── button.spec.ts
```

The component is placed under `shared/ui` because it is reusable visual infrastructure.

It does not belong under:

```text
core/
```

because `core` contains application infrastructure such as:

* authentication
* guards
* interceptors
* error handling
* application state
* initialization

The Button is different: it is a visual building block.

---

# Button Component

Current `button.ts`:

```ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  protected readonly type = input<
    'button' | 'submit' | 'reset'
  >('button');

  protected readonly variant = input<
    'primary' | 'secondary'
  >('primary');
}
```

---

# Understanding the Selector

The component selector is:

```ts
selector: 'app-button',
```

This allows other components to use:

```html
<app-button></app-button>
```

Angular recognizes the element and renders the Button component.

Conceptually:

```text
<app-button>
       │
       ▼
Button component
       │
       ├── button.ts
       ├── button.html
       └── button.css
```

---

# Understanding the `type` Input

The component defines:

```ts
protected readonly type = input<
  'button' | 'submit' | 'reset'
>('button');
```

This allows the parent component to control the native HTML button type.

For example:

```html
<app-button type="submit">
  Sign In
</app-button>
```

The Button template passes that value to the native button:

```html
<button [type]="type()">
```

Conceptually, Angular produces:

```html
<button type="submit">
  Sign In
</button>
```

The component therefore preserves normal HTML button behavior.

### Why default to `button`?

The default is:

```ts
('button')
```

This is intentional.

A normal button should not accidentally submit a form.

When a button should submit a form, the page explicitly requests:

```html
<app-button type="submit">
```

---

# Understanding the `variant` Input

The component also defines:

```ts
protected readonly variant = input<
  'primary' | 'secondary'
>('primary');
```

This controls the visual variant.

Example:

```html
<app-button variant="primary">
  Sign In
</app-button>
```

or:

```html
<app-button variant="secondary">
  Continue as Guest
</app-button>
```

The TypeScript type restricts the component to the supported variants:

```text
primary
secondary
```

This provides type safety and prevents arbitrary variant names from being used accidentally.

---

# Why Use Angular Signal Inputs?

The component uses:

```ts
input()
```

instead of the older decorator-based:

```ts
@Input()
```

Signal inputs are the modern Angular approach for component inputs.

Because an input is a signal, its current value is read using:

```ts
type()
```

and:

```ts
variant()
```

For example:

```html
[type]="type()"
[class]="variant()"
```

This connects the component inputs to the native HTML element.

---

# Button Template

Current `button.html`:

```html
<button
  [type]="type()"
  [class]="variant()"
>
  <ng-content />
</button>
```

The template has three important responsibilities:

1. Render a real native `<button>`
2. Apply the configured button type
3. Project content supplied by the parent

---

# Native HTML Button

The component deliberately renders:

```html
<button>
```

instead of using a generic element such as:

```html
<div>
```

This preserves native browser behavior and accessibility.

The Button component is therefore an Angular abstraction **around a real HTML button**, not a replacement for the HTML button concept.

---

# Content Projection with `ng-content`

The template contains:

```html
<ng-content />
```

This allows the parent component to provide the button's content.

For example:

```html
<app-button>
  Sign In
</app-button>
```

The Button component receives:

```text
Sign In
```

and places it inside the native button.

Conceptually:

```text
Parent
│
└── <app-button>
      Sign In
    </app-button>
           │
           ▼
      <ng-content />
           │
           ▼
    <button>
      Sign In
    </button>
```

This means the Button component does not need to know what the button says.

It can be reused for:

```text
Sign In
Create Account
Save
Cancel
Continue
Delete
```

and many other actions.

---

# Button Styling

Current `button.css` provides common styling:

```css
button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0.75rem 1rem;

  border: 1px solid transparent;
  border-radius: 0.5rem;

  font: inherit;
  font-weight: 600;
  line-height: 1.2;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}
```

The component currently supports two variants.

## Primary

```css
button.primary {
  ...
}
```

The primary variant is intended for the main action on a page.

Examples:

```text
Sign In
Create Account
Save
Continue
```

## Secondary

```css
button.secondary {
  ...
}
```

The secondary variant is intended for less prominent actions.

Examples:

```text
Cancel
Back
Continue as Guest
```

---

# Interaction States

The Button component also provides common interaction states.

## Hover

The appearance changes when the pointer is placed over the button.

```css
button.primary:hover {
  ...
}
```

## Keyboard Focus

The component provides a visible focus indicator:

```css
button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

This is important for keyboard accessibility.

## Disabled

Disabled buttons use:

```css
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

This gives disabled buttons a consistent visual state.

---

# Why We Did Not Add More Features Yet

The first version intentionally remains small.

We did **not** add:

```text
loading
fullWidth
size
icon
danger
success
```

even though these could eventually be useful.

This is intentional.

A reusable component should grow from real application requirements rather than trying to predict every possible feature.

For example, if the application later needs:

```html
<app-button [loading]="isSaving()">
```

then loading behavior can be added based on an actual requirement.

Similarly, a `danger` variant can be added when we have a real destructive action such as account deletion.

---

# Why We Did Not Create a Generic Navbar or Footer

The same principle applies to other possible UI components.

Although `PublicLayout` and `AppLayout` currently have similar header/footer structures, their responsibilities may diverge as the application grows.

Therefore, we intentionally did not extract:

```text
Navbar
Footer
```

yet.

Likewise, there is currently no strong real-world requirement for:

```text
Modal
Toast
List Item
Form Wrapper
```

so these remain deferred.

---

# Current Reusable UI Decision

The analysis for Phase 5.9 resulted in:

```text
5.9 Reusable UI Primitives

Create now
├── Button
├── FormField
└── Alert

Consider later
├── Card
└── Loader / Spinner

Defer
├── Modal
├── Toast
├── Navbar
├── Footer
├── Form Wrapper
└── List Item
```

This keeps the starter simple while still establishing useful reusable UI infrastructure.

---

# Important Architecture Lesson

There is a difference between **pages**, **layouts**, and **UI primitives**.

```text
App
│
├── Layouts
│   ├── PublicLayout
│   └── AppLayout
│
├── Pages
│   ├── Landing
│   ├── Login
│   ├── Register
│   └── Guest
│
└── Shared UI
    ├── Button
    ├── FormField
    └── Alert
```

### Pages

Pages contain application-specific content and behavior.

Example:

```text
Login
└── authentication form
```

### Layouts

Layouts provide the surrounding visual structure.

Example:

```text
PublicLayout
├── header
├── page content
└── footer
```

### UI primitives

UI primitives provide small reusable visual building blocks.

Example:

```text
Button
└── common button appearance and behavior
```

This separation helps prevent the starter from becoming tightly coupled to any particular application.

---

# Testing Checklist

Before moving to the next step, the Button component should be verified in isolation and then through real usage.

Current checklist:

* [ ] Component compiles without TypeScript errors
* [ ] `<app-button>` can be imported into another standalone component
* [ ] Button renders a native `<button>`
* [ ] Default type is `button`
* [ ] `type="submit"` works
* [ ] Primary variant renders correctly
* [ ] Secondary variant renders correctly
* [ ] Parent content appears inside the button
* [ ] Hover state works
* [ ] Keyboard focus is visible
* [ ] Disabled state works
* [ ] Existing application styling remains visually consistent

The next step is to replace **one existing button in the Landing page** with the reusable Button component.

We will migrate one button first rather than changing every page at once. This gives us a controlled test of the component before using it throughout the application.

---

# Checkpoint

**Phase:** 5 — Reusable UI / Layout Foundation

**Step:** 5.9.2 — Create reusable Button component

**Status:** Component created; ready for integration testing.

**Next:** 5.9.3 — Replace an existing Landing page button with `<app-button>`.
