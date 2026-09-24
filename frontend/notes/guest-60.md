# Phase 5.6 — Guest Page Integration

## Overview

The Guest page is now integrated into the reusable `PublicLayout`.

This completes the integration of all current public-facing pages:

```text
Landing      ✅
Login        ✅
Register     ✅
Guest        ✅
```

The Guest page is intentionally still a **generic UI placeholder**.

No application-specific guest-session behavior has been added to the starter.

The resulting structure is:

```text
App
│
└── PublicLayout
    ├── Header
    ├── RouterOutlet
    │   └── Guest
    └── Footer
```

---

# 1. Guest Page Responsibility

The Guest page is responsible for presenting the application's guest entry point.

Currently it provides:

* a Back to home link
* a Guest heading
* a short explanation
* a note explaining that guest functionality can be connected later
* a disabled Continue as Guest button
* a Sign in instead link

It does **not** currently create or manage a guest session.

This is intentional.

---

# 2. Why Guest Functionality Is Not Implemented Yet

The starter is designed to be reusable across different applications.

Different applications may have completely different meanings for "guest mode."

For example:

```text
Application A
└── Anonymous temporary session

Application B
└── Limited read-only access

Application C
└── Temporary quiz/session access

Application D
└── No guest functionality at all
```

Therefore, implementing a specific guest-session API in the starter would make the starter unnecessarily tied to one application's requirements.

The current page provides the UI foundation while leaving the actual guest behavior to the application that eventually reuses the starter.

---

# 3. Guest Component Structure

The Guest page contains:

```text
src/app/pages/guest/
├── guest.ts
├── guest.html
└── guest.css
```

The TypeScript component is intentionally simple:

```ts
export class Guest {}
```

There is currently no API request and no application state associated with the Guest page.

This is appropriate for the current phase.

---

# 4. Guest Navigation

The Guest page provides two important navigation paths.

### Back to home

```text
Guest
  │
  ▼
/
```

### Sign in instead

```text
Guest
  │
  ▼
/login
```

Both use Angular `RouterLink`.

This keeps navigation inside the Angular single-page application.

---

# 5. Guest Placeholder Action

The current button is:

```html
<button type="button" disabled>
  Continue as Guest
</button>
```

The button is deliberately disabled.

This communicates that the UI entry point exists, but the underlying guest functionality has not yet been implemented.

We do not want a button that appears functional but silently does nothing.

---

# 6. Guest and PublicLayout

Before integration, Guest used:

```css
min-height: 100vh;
```

After integration, it uses:

```css
min-height: 100%;
```

The reason is the same as Login and Register.

`PublicLayout` owns the viewport:

```text
PublicLayout
└── min-height: 100vh
```

Guest fills the available layout space:

```text
PublicLayout
└── Guest
    └── min-height: 100%
```

This prevents nested pages from independently creating another viewport-sized container.

---

# 7. Layout Responsibility

The Guest page does not provide its own global header or footer.

Instead:

```text
PublicLayout
│
├── Header
│
├── Guest
│
└── Footer
```

This keeps the shared structure in one place.

If the header or footer changes later, Guest does not need to be modified.

---

# 8. Responsive Design

Guest follows the same responsive approach as the other public pages.

Desktop:

```text
┌──────────────────────────────────────────────┐
│                Public Header                 │
├──────────────────────────────────────────────┤
│                                              │
│              Continue as Guest               │
│                                              │
│       Explore the application...            │
│                                              │
│         [ Continue as Guest ]                │
│                                              │
│             Sign in instead                  │
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
│  Continue as Guest   │
│                      │
│   Guest information  │
│                      │
│ [ Continue as Guest] │
│                      │
│   Sign in instead    │
│                      │
├──────────────────────┤
│    Public Footer     │
└──────────────────────┘
```

The content remains centered and the available width adapts to smaller screens.

---

# 9. Generic Starter Principle

Guest mode demonstrates an important starter-template principle:

> Build reusable infrastructure, not application-specific business logic.

The starter provides:

```text
Public UI
Routing
Authentication infrastructure
Error handling
Request state
Layouts
Reusable patterns
```

The eventual application provides:

```text
Guest business rules
Guest session behavior
Application-specific APIs
Application-specific pages
Application-specific permissions
```

This separation allows the starter to be reused without carrying unnecessary application assumptions.

---

# 10. Testing Checklist

The Guest page was tested after integrating it into `PublicLayout`.

### Navigation

* [x] `/guest` loads correctly
* [x] Back to home works
* [x] Sign in instead works
* [x] Public routes continue to work

### Guest UI

* [x] Guest heading displays correctly
* [x] Guest explanation displays correctly
* [x] Guest note displays correctly
* [x] Continue as Guest button is visibly disabled
* [x] No unintended API request is made

### Layout

* [x] Guest displays correctly inside PublicLayout
* [x] Header remains visible
* [x] Footer remains visible
* [x] No nested `100vh` problem
* [x] Desktop layout works
* [x] Mobile layout works

---

# 11. Public Pages — Completed

All four current public pages now use the same layout:

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

The shared structure is:

```text
┌──────────────────────────────────────────────┐
│                    Header                    │
├──────────────────────────────────────────────┤
│                                              │
│                  Page Content                │
│                                              │
├──────────────────────────────────────────────┤
│                    Footer                    │
└──────────────────────────────────────────────┘
```

This is the completed **public-page foundation**.

---

# 12. Phase 5 Progress

The current UI/layout phase is now:

```text
5. Reusable UI / Layout Foundation

5.1 Create PublicLayout                ✅
5.2 Test PublicLayout                  ✅
5.3 Integrate Landing                  ✅
5.4 Integrate Login                    ✅
5.5 Integrate Register                 ✅
5.6 Integrate Guest                    ✅
5.7 Create AppLayout                   ← next
5.8 Move /app into AppLayout
5.9 Extract reusable UI primitives
5.10 Responsive polish
```

---

# 13. Architectural Checkpoint

The application now has a clear distinction between public and protected areas.

```text
App
│
├── PublicLayout
│   ├── Landing
│   ├── Login
│   ├── Register
│   └── Guest
│
├── /app
│   └── Protected application area
│
├── /auth-test
│   └── Temporary developer page
│
└── /request-state-test
    └── Temporary developer page
```

The next architectural step is to give `/app` its own reusable layout.

---

# 14. Main Lessons

### 1. A placeholder can be intentional

The Guest page does not need backend behavior simply because the UI exists.

### 2. Keep reusable starters generic

Application-specific guest-session behavior belongs in the application that consumes the starter.

### 3. Shared layouts eliminate duplication

All public pages now receive the same header, main structure, and footer.

### 4. Pages should not own the viewport unnecessarily

The layout owns `100vh`; pages use the available space.

### 5. Navigation remains page-specific

Guest knows where Login and Home are, while PublicLayout does not need to know the details of Guest.

---

# 15. Checkpoint

**Phase 5.6 — Guest Integration: COMPLETE**

The complete public-page foundation is now finished:

```text
Landing      ✅
Login        ✅
Register     ✅
Guest        ✅
```

The next step is:

**Phase 5.7 — Create AppLayout**

The protected `/app` area will receive its own reusable application layout while remaining separate from `PublicLayout`.

We will first inspect the current `/app` page before changing it, just as we did with Guest.
