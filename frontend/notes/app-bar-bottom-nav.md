# App Shell 03 — App Bar + Bottom Navigation

## Overview

This design provides a mobile-friendly application shell with:

* Top app bar
* Hamburger menu
* Search action
* Main content area
* Bottom navigation
* Prominent "New" action

The design is intentionally generic so it can be reused by different projects.

---

## Visual Structure

```text
┌────────────────────────────────────────────┐
│ ☰            PROJECT APP              🔍  │
├────────────────────────────────────────────┤
│                                            │
│                  CONTENT                   │
│                                            │
│                                            │
├────────────────────────────────────────────┤
│  👤       ⌂        ＋       ▦        ◆    │
│ Profile  Home     New   Dashboard  Genre  │
└────────────────────────────────────────────┘
```

When the hamburger button is opened:

```text
┌────────────────────────────────────────────┐
│ ✕            PROJECT APP              🔍  │
├────────────────────────────────────────────┤
│ Settings                                   │
│ Contact Us                                 │
│ Community                                  │
│ Logout                                     │
├────────────────────────────────────────────┤
│                                            │
│                  CONTENT                   │
│                                            │
└────────────────────────────────────────────┘
```

---

## Design Components

### App Bar

The app bar contains:

* Hamburger menu button
* Centered project/application name
* Search button

The hamburger button changes between:

```text
☰
```

and:

```text
✕
```

depending on the menu state.

### Secondary Menu

The hamburger menu displays a simple vertical list:

* Settings
* Contact Us
* Community
* Logout

These are currently placeholder navigation items for the starter template.

Actual application behavior should be implemented by the project using this design.

### Main Content

The main content area provides the space where routed application pages are displayed.

The shell does not contain application-specific content.

### Bottom Navigation

The bottom navigation contains five generic items:

1. Profile
2. Home
3. New
4. Dashboard
5. Genre

The icons intentionally use simple characters rather than an icon library:

```text
👤
⌂
＋
▦
◆
```

This keeps the starter lightweight and avoids introducing an unnecessary dependency.

The "New" action is visually emphasized with a circular icon.

---

## Implementation Principles

### Keep the shell generic

The shell must not contain domain-specific concepts.

For example, a Mandarin-learning project may later change:

```text
Genre
```

to something appropriate for that application.

The starter only provides the layout pattern.

### Keep navigation semantic

Navigation items use links because they represent navigation.

Buttons are used for actions such as:

* Opening/closing the hamburger menu
* Search
* Other actions that do not represent navigation

### Keep icons simple

This implementation intentionally does not introduce an icon package.

Simple characters are sufficient for the starter design and make the shell easy to understand and customize.

An individual project can introduce a dedicated icon system later if needed.

---

## Current Scope

The following are intentionally placeholders:

* Search functionality
* Logout functionality
* Settings page
* Contact Us page
* Community page
* Actual bottom-navigation destinations
* Active navigation state

These should be implemented at the application level rather than as part of the reusable shell design.

---

## What Was Learned

This design was built incrementally:

1. Create the basic application shell.
2. Add the top app bar.
3. Add bottom navigation.
4. Test the shell visually.
5. Add hamburger menu state.
6. Test open/close behavior.
7. Replace temporary state text with the actual menu.
8. Add menu styling.
9. Improve bottom-navigation styling.
10. Keep the icon system intentionally simple.
11. Separate reusable layout structure from application-specific functionality.

This follows the starter-template principle:

> Build the reusable structure first. Add project-specific behavior only when the consuming application needs it.

---

## Design Library Principle

The design library contains alternative designs.

The active application layout should use one selected design rather than creating one large configurable component containing every possible design.

For example:

```text
layouts/
└── designs/
    └── app/
        └── shells/
            ├── simple/
            ├── dashboard/
            └── app-bar-bottom-nav/
```

Each design can therefore evolve independently.

---

## Status

**Completed**

App Shell 03 is currently selected as the application's active application-shell design.

Future projects can choose this design or use another design from the library.
