## proper naming structure

Refactor naming folder and file


```
src/app/
│
├── core/                  ← infrastructure
│
├── layouts/               ← composition + design library
│   ├── app-layout/
│   ├── public-layout/
│   └── designs/
│
├── pages/                 ← actual screens
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── guest/
│   ├── landing/
│   ├── auth-test/
│   └── request-state-test/
│
└── shared/                ← small reusable UI
    └── ui/
        └── button/
```



# Project App Starter Phases 

```
1. Backend foundation
        ↓
2. Angular core infrastructure
        ↓
3. Design library        ← DONE ✅
        ↓
4. Layouts               ← nearly done
        ↓
5. Pages                 ← NEXT
        ↓
6. Integration & testing
        ↓
7. Documentation / cleanup
        ↓
8. Starter COMPLETE ✅

```


## 1. Integration testing

Make sure everything works together:

```
Landing
  ↓
Login
  ↓
Dashboard
  ↓
Protected API
  ↓
Access token expires
  ↓
Automatic refresh
  ↓
Request succeeds
  ↓
Logout
  ↓
Protected API → 401
```

Also test:

```
registration
invalid credentials
server validation errors
route guard
direct /app access while logged out
refresh failure
multiple requests during refresh
browser refresh while authenticated
browser refresh while logged out
```

This is probably the most important remaining work.

## 2. Remove temporary/demo code

For example:

```
auth-test/
request-state-test/
```

We decide whether each is:

useful as a permanent development test page, or
removed from the starter.

Also remove unused imports, placeholder handlers, temporary routes, etc.

## 3. Final architecture cleanup

We do one final pass through:

```
core/
layouts/
pages/
shared/
```

and ask:

Does this belong here?

For example:

```
authentication logic → core/auth
API configuration → core/config
reusable visual components → layouts/designs / shared/ui
page-specific UI → pages
layout composition → layouts
application-specific business logic → not in the generic starter
```

This prevents the starter from slowly becoming a specific application.

## 4. Documentation

Then finalize things like:

frontend/README.md
layouts/designs/README.md

and document:

```
project structure
authentication architecture
cookie-based JWT approach
CSRF
routing
guards
interceptors
layouts
designs
pages
how to add a new page
how to add a new design
```

## 5. Final build/test

Run the actual production checks:

Angular build
TypeScript compilation
unit tests
lint/format checks (if configured)
Django checks
Django tests