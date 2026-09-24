# Angular Beginner Learning Notes

These notes explain the main Angular and TypeScript terms used in the project starter.

The goal is not to memorize everything at once. Use this as a reference when a term appears in the code.

---

# 1. Angular

**Angular** is a frontend framework for building web applications.

It provides tools for:

* components
* routing
* forms
* HTTP requests
* dependency injection
* state management
* templates
* testing

In this project:

```text
Angular
    ↓
Builds the browser application
    ↓
Communicates with Django/DRF API
```

---

# 2. Component

A **component** is a piece of the application's user interface.

A component normally consists of:

```text
component.ts
component.html
component.css
component.spec.ts
```

For example:

```text
pages/login/
├── login.ts
├── login.html
├── login.css
└── login.spec.ts
```

The TypeScript file defines the component's behavior.

The HTML defines what appears on the screen.

The CSS defines its appearance.

The spec file contains tests.

Think of a component as:

> "One piece of UI with its own behavior."

Examples in this project:

```text
Landing
Login
Register
Dashboard
DashboardHeader
BottomNavigation
Button
```

---

# 3. Standalone Component

Modern Angular uses **standalone components**.

A standalone component can directly declare the things it needs:

```ts
@Component({
  imports: [
    RouterLink,
    ReactiveFormsModule,
  ],
})
```

Older Angular applications commonly used `NgModule`.

Our project intentionally uses standalone components so that components are more self-contained.

---

# 4. Selector

A **selector** is the HTML name used to place a component inside another template.

Example:

```ts
@Component({
  selector: 'app-dashboard-header',
})
```

This allows:

```html
<app-dashboard-header />
```

to render the component.

Think of the selector as the component's HTML tag.

---

# 5. Template

A **template** is the HTML that defines what a component displays.

Example:

```html
<h1>{{ title }}</h1>
```

Angular processes the template and connects it to the component's TypeScript code.

Our project normally keeps templates in separate `.html` files:

```text
dashboard.ts
dashboard.html
```

---

# 6. Data Binding

**Data binding** connects TypeScript data with the HTML template.

For example:

```html
<h1>{{ title() }}</h1>
```

The template is displaying a value from the component.

Common Angular binding types include:

```text
{{ value }}
[property]="value"
(event)="method()"
[(ngModel)]="value"
```

In our project, you'll commonly see:

```html
{{ title() }}
```

and:

```html
(click)="toggleMenu()"
```

---

# 7. Interpolation

**Interpolation** means displaying a TypeScript value inside HTML using:

```text
{{ }}
```

Example:

```html
<span>{{ title() }}</span>
```

If the value is:

```text
Dashboard
```

Angular displays:

```text
Dashboard
```

---

# 8. Event Binding

Event binding allows HTML events to call component code.

Example:

```html
<button (click)="toggleMenu()">
  Menu
</button>
```

This means:

> When the button is clicked, call `toggleMenu()`.

Common events include:

```text
click
input
change
submit
keydown
```

---

# 9. Input

An **input** allows a parent component to provide data to a child component.

Example:

```ts
readonly title = input('Dashboard');
```

A parent could provide:

```html
<app-dashboard-header title="Profile" />
```

The child receives:

```text
Profile
```

Inputs are useful for making components reusable.

---

# 10. Output

An **output** allows a child component to notify its parent that something happened.

Example:

```ts
readonly menuToggle = output<void>();
```

The component can emit an event:

```ts
this.menuToggle.emit();
```

The parent can listen:

```html
<app-dashboard-header
  (menuToggle)="toggleMenu()"
/>
```

Think of it as:

```text
Parent
   ↓ input
Child
   ↓ output/event
Parent
```

---

# 11. Signal

A **signal** is Angular's reactive way of storing a value that can change.

Example:

```ts
protected readonly isMenuOpen = signal(false);
```

The initial value is:

```text
false
```

You read it using:

```ts
isMenuOpen()
```

You can change it using:

```ts
isMenuOpen.set(true);
```

or:

```ts
isMenuOpen.update((value) => !value);
```

Example:

```ts
protected toggleMenu(): void {
  this.isMenuOpen.update((isOpen) => !isOpen);
}
```

If the value changes, Angular knows that anything using the signal may need to update.

Think:

> Signal = reactive value.

---

# 12. Reactive

**Reactive** means that the application responds automatically when something changes.

For example:

```text
Signal changes
     ↓
Angular knows something changed
     ↓
Relevant UI updates
```

This idea appears throughout Angular.

Reactive programming becomes especially important when dealing with:

* signals
* Observables
* forms
* HTTP requests
* application state

---

# 13. Observable

An **Observable** represents a stream of values or events that may arrive over time.

Angular uses Observables heavily, especially with HTTP requests.

Example:

```ts
this.authService.login(...).subscribe({
  next: () => {
    // success
  },
  error: () => {
    // error
  },
});
```

The HTTP request returns an Observable.

Think of it like:

```text
Observable
    │
    ├── waiting...
    │
    └── value arrives
            ↓
         subscribe()
```

An Observable can potentially produce:

```text
0 values
1 value
many values
```

depending on what it represents.

An HTTP request normally produces one successful response or an error.

---

# 14. Subscribe

**`subscribe()`** means:

> "Listen to this Observable and tell me what to do when something happens."

Example:

```ts
this.authService.login(credentials).subscribe({
  next: (response) => {
    // successful response
  },

  error: (error) => {
    // request failed
  },
});
```

The two common handlers are:

```text
next → successful value
error → error occurred
```

There can also be:

```text
complete → Observable finished
```

---

# 15. Observable vs Signal

These are related but serve different purposes.

### Signal

Usually represents current application state:

```ts
isMenuOpen = signal(false);
```

Think:

> "What is the current value?"

### Observable

Usually represents asynchronous or streaming events:

```ts
authService.login(...)
```

Think:

> "What values/events will arrive over time?"

A simplified comparison:

```text
Signal
    ↓
Current reactive state

Observable
    ↓
Asynchronous/event stream
```

They can work together.

---

# 16. Service

A **service** is a class that contains reusable application logic that should not belong directly inside a component.

For example:

```text
AuthService
```

handles authentication-related API communication.

Instead of putting HTTP authentication code directly inside:

```text
Login
Register
Dashboard
```

we centralize it:

```text
Login
   ↓
AuthService
   ↓
Django API
```

Services are useful for things like:

* API communication
* authentication
* shared state
* reusable business logic
* application configuration

---

# 17. Dependency Injection

**Dependency Injection (DI)** is Angular's system for providing objects/services to other classes.

For example:

```ts
private readonly authService = inject(AuthService);
```

This means:

> "Give this component an instance of `AuthService`."

The component does not need to manually create it.

Instead:

```text
Angular
   ↓
creates/provides service
   ↓
Component receives service
```

This makes code easier to organize and test.

---

# 18. `inject()`

`inject()` is Angular's modern way of requesting a dependency.

Example:

```ts
private readonly router = inject(Router);
```

The component is asking Angular for the Router service.

Another example:

```ts
private readonly authService = inject(AuthService);
```

---

# 19. Router

The **Router** controls navigation between pages.

For example:

```ts
this.router.navigate(['/login']);
```

means:

> Navigate the browser application to `/login`.

The router uses the route definitions in:

```text
app.routes.ts
```

---

# 20. Route

A **route** connects a URL to a component.

Example:

```ts
{
  path: 'login',
  component: Login,
}
```

means:

```text
/login
   ↓
Login component
```

Our application also has:

```text
/       → Landing
/login  → Login
/register → Register
/app    → Dashboard through AppLayout
```

---

# 21. Router Outlet

`<router-outlet>` is the location where Angular displays the component for the current route.

Example:

```html
<router-outlet />
```

Think of it as:

```text
"Put the current routed page here."
```

For example:

```text
AppLayout
    │
    ├── Header
    │
    ├── <router-outlet>
    │        ↓
    │     Dashboard
    │
    └── BottomNavigation
```

---

# 22. Route Guard

A **route guard** controls whether navigation to a route is allowed.

Our authentication guard protects:

```text
/app
```

Conceptually:

```text
Visit /app
    ↓
authGuard
    ↓
Authenticated?
   / \
 yes  no
  ↓    ↓
Page  Login
```

The guard improves the user experience and prevents unauthenticated navigation into protected UI.

However:

> A frontend guard is not a security boundary.

The Django backend must still enforce authentication and authorization.

---

# 23. Interceptor

An **HTTP interceptor** sits between Angular code and the HTTP request.

Think of it as a checkpoint:

```text
Component
    ↓
HTTP request
    ↓
Interceptor
    ↓
Django API
```

Our authentication interceptor handles common authentication-related request behavior.

For example:

```ts
withCredentials: true
```

and CSRF headers for state-changing requests.

This prevents every page from having to repeat the same HTTP setup.

---

# 24. HTTP Client

Angular's **HttpClient** is used to communicate with APIs.

Example:

```ts
this.http.get(...)
this.http.post(...)
```

Our Angular application uses it to communicate with Django/DRF.

Typical flow:

```text
Angular
   ↓
HttpClient
   ↓
Interceptor
   ↓
HTTP request
   ↓
Django/DRF
```

---

# 25. Reactive Forms

**Reactive Forms** are Angular's programmatic form system.

Our login and register pages use:

```ts
ReactiveFormsModule
```

and form controls.

Example:

```ts
this.fb.nonNullable.group({
  username: ['', Validators.required],
  password: ['', Validators.required],
});
```

The form is represented in TypeScript.

This allows Angular to manage:

* form values
* validation
* touched/untouched state
* valid/invalid state
* errors
* submission state

---

# 26. FormControl

A **FormControl** represents one field in a form.

For example:

```text
username
password
email
```

Each can have:

```text
value
validators
errors
touched state
valid/invalid state
```

---

# 27. FormGroup

A **FormGroup** groups multiple form controls together.

Example:

```ts
this.fb.nonNullable.group({
  username: [''],
  email: [''],
  password: [''],
});
```

Think:

```text
FormGroup
├── username
├── email
└── password
```

---

# 28. Validator

A **validator** checks whether a form value meets a rule.

Example:

```ts
Validators.required
```

means:

> The field cannot be empty.

Another example:

```ts
Validators.minLength(8)
```

means:

> The value must contain at least 8 characters.

Angular validation improves the user experience, but the Django backend must still validate the submitted data.

---

# 29. `async`

`async` is a JavaScript/TypeScript keyword used with asynchronous functions.

For example:

```ts
async function loadData() {
  const data = await something();
}
```

It is often used together with `await`.

---

# 30. `await`

`await` means:

> Wait for this asynchronous operation to finish before continuing this function.

For example:

```ts
const result = await firstValueFrom(...);
```

In our application initializer, this allows Angular initialization to wait for CSRF initialization.

---

# 31. Promise

A **Promise** represents one future result.

Think:

```text
Promise
    ↓
Something will eventually finish
    ↓
success OR failure
```

Promises commonly work with:

```ts
await
```

Observables and Promises are different abstractions, although Angular provides utilities for converting between them.

---

# 32. `firstValueFrom()`

`firstValueFrom()` converts an Observable into a Promise that resolves when the Observable produces its first value.

For example:

```ts
await firstValueFrom(csrfService.initialize());
```

This is useful when code needs Promise-style control flow, such as application initialization.

---

# 33. Application Initializer

An **application initializer** runs startup logic when Angular starts.

Our initializer is responsible for preparing things needed before normal application use.

Currently, this includes CSRF initialization.

Conceptually:

```text
Angular starts
    ↓
Application initializer
    ↓
Initialize CSRF
    ↓
Application continues
```

---

# 34. Error Handling

Error handling means deciding what happens when something fails.

Our application has:

```text
core/errors/
├── api-error.models.ts
├── api-error.service.ts
└── app-error-handler.ts
```

The goal is to avoid having every page interpret backend errors differently.

For example:

```text
Django error
    ↓
ApiErrorService
    ↓
Normalized Angular error
    ↓
Page displays appropriate message
```

---

# 35. API

**API** means Application Programming Interface.

In this project, the Angular frontend communicates with Django through an HTTP API.

For example:

```text
Angular
   ↓
POST /api/auth/login/
   ↓
Django/DRF
```

The API is the communication boundary between frontend and backend.

---

# 36. REST API

A **REST API** is an HTTP-based API style where resources and actions are accessed through URLs and HTTP methods.

Common HTTP methods:

```text
GET     → retrieve
POST    → create/action
PUT     → replace
PATCH   → partially update
DELETE  → delete
```

Our Django backend uses Django REST Framework to provide the API.

---

# 37. JSON

**JSON** is a common format for sending structured data between frontend and backend.

Example:

```json
{
  "username": "example",
  "email": "user@example.com"
}
```

Angular sends JSON to Django and Django returns JSON responses.

---

# 38. Cookie

A **cookie** is small data stored by the browser and associated with a website.

Our authentication cookies contain JWT tokens.

Important distinction:

```text
Normal cookie
    ↓
JavaScript may be able to read it

HttpOnly cookie
    ↓
JavaScript cannot read it
```

Our JWT cookies are HttpOnly.

This means Angular does not directly access the JWT.

---

# 39. JWT

**JWT** means JSON Web Token.

It is a signed token commonly used to represent authenticated identity/claims.

Our backend creates:

```text
Access token
Refresh token
```

The browser stores them as HttpOnly cookies.

Angular does not read the JWT contents.

---

# 40. Access Token

The **access token** is the short-lived token used to authenticate normal API requests.

Conceptually:

```text
Browser
   ↓
access cookie
   ↓
Django authentication
   ↓
Request authorized
```

Because it is short-lived, it limits the useful lifetime of an exposed access credential.

---

# 41. Refresh Token

The **refresh token** is used to obtain new access credentials after the access token expires.

It is longer-lived than the access token.

In our architecture, it is stored in a separate HttpOnly cookie with a restricted path:

```text
/api/auth/refresh/
```

---

# 42. CSRF

**CSRF** means Cross-Site Request Forgery.

It is a security problem that can occur when browsers automatically send authentication cookies.

Our architecture uses a CSRF token for state-changing requests.

Conceptually:

```text
Authentication cookie
        +
CSRF protection
        ↓
Safer cookie-based authentication
```

---

# 43. CORS

**CORS** means Cross-Origin Resource Sharing.

Our Angular and Django development servers run on different origins:

```text
Angular
http://localhost:4200

Django
http://localhost:8000
```

CORS tells the browser which frontend origins are allowed to communicate with the backend.

Because we use cookies, credentials must also be handled correctly.

---

# 44. `withCredentials`

`withCredentials: true` tells the browser that credentials such as cookies should be included with cross-origin HTTP requests when permitted by the server.

Our interceptor applies this behavior centrally.

Conceptually:

```text
Angular
   ↓
withCredentials: true
   ↓
Browser sends appropriate cookies
   ↓
Django
```

---

# 45. HttpOnly

`HttpOnly` is a cookie security attribute.

When a cookie is HttpOnly:

```text
JavaScript
    X
    │
    └── cannot read cookie
```

But the browser can still send it to the appropriate server.

This is why our Angular code does not contain:

```ts
document.cookie
```

for JWT access or refresh tokens.

---

# 46. SameSite

`SameSite` is a cookie attribute that controls when browsers send cookies in cross-site situations.

Our backend configures it according to the application's environment and deployment requirements.

It is one part of the broader cookie security configuration.

---

# 47. Dependency

A **dependency** is something a piece of code needs in order to work.

For example:

```ts
AuthService
```

may depend on:

```text
HttpClient
Router
ApiErrorService
```

Angular's dependency injection system provides these dependencies.

---

# 48. Parent and Child Components

Angular components can form a hierarchy.

For example:

```text
AppLayout
│
├── DashboardHeader
├── Dashboard
└── BottomNavigation
```

Here:

```text
AppLayout
```

is the parent.

The other components are children.

Parents can provide data through:

```text
input
```

Children can communicate events upward through:

```text
output
```

---

# 49. Layout vs Design vs Page

This is one of the most important distinctions in this project.

### Page

A complete route-level screen.

```text
Dashboard
Login
Register
Landing
```

### Layout

Defines the overall structure surrounding pages.

```text
PublicLayout
AppLayout
```

### Design

A reusable visual structure.

```text
DashboardHeader
BottomNavigation
SimpleFooter
SidebarNavigation
```

Think:

```text
Layout
   ↓
composes
   ↓
Designs + Router Outlet
   ↓
Page
```

---

# 50. Core vs Shared

Another important distinction:

### `core/`

Application infrastructure.

Examples:

```text
AuthService
AuthGuard
Interceptor
ApiErrorService
CsrfService
```

### `shared/ui/`

Small reusable visual components.

Examples:

```text
Button
Input
Modal
Card
```

A simple rule:

> `core` helps the application work.
> `shared/ui` helps the application look and behave consistently.

---

# 51. TypeScript

**TypeScript** is the programming language used by Angular.

It is based on JavaScript but adds features such as:

* types
* interfaces
* classes
* access modifiers
* generics
* better tooling

Example:

```ts
function greet(name: string): string {
  return `Hello ${name}`;
}
```

The type:

```text
string
```

helps describe what the function expects and returns.

---

# 52. Type

A **type** describes what kind of value something can contain.

Examples:

```ts
string
number
boolean
```

Example:

```ts
let username: string;
let age: number;
let authenticated: boolean;
```

---

# 53. Interface

An **interface** describes the structure an object should have.

For example:

```ts
interface User {
  id: number;
  username: string;
  email: string;
}
```

This helps TypeScript understand the shape of data.

Interfaces are especially useful when working with API responses.

---

# 54. Generic

A **generic** allows code to work with different types while retaining type information.

You may encounter things like:

```ts
Observable<User>
```

This means:

> An Observable that produces `User` values.

Another example:

```ts
Record<string, string[]>
```

This describes an object whose:

```text
keys    → strings
values  → arrays of strings
```

---

# 55. `private`

`private` means a property or method is intended to be used only inside its class.

Example:

```ts
private readonly authService = inject(AuthService);
```

Other code should not directly access it.

---

# 56. `protected`

`protected` means the member is available to the class and its subclasses.

In Angular components, you'll often see:

```ts
protected readonly registerForm = ...
```

This is useful when the template needs access to the member while still keeping it out of the class's public API.

---

# 57. `readonly`

`readonly` means the reference should not be reassigned after initialization.

Example:

```ts
private readonly router = inject(Router);
```

The variable should continue referring to that Router instance.

It does not necessarily mean that every object inside it is completely immutable.

---

# 58. `const`

`const` creates a variable binding that cannot be reassigned.

Example:

```ts
const username = 'alice';
```

You cannot later do:

```ts
username = 'bob';
```

---

# 59. Class

A **class** is a blueprint for creating objects and organizing related data and behavior.

Angular components and services are commonly classes.

Example:

```ts
export class Dashboard {}
```

and:

```ts
export class AuthService {}
```

---

# 60. Method

A **method** is a function that belongs to a class.

Example:

```ts
protected toggleMenu(): void {
  this.isMenuOpen.update((isOpen) => !isOpen);
}
```

`toggleMenu()` is a method of the component.

---

# 61. Property

A **property** is data belonging to a class/object.

Example:

```ts
protected isSubmitting = false;
```

`isSubmitting` is a property.

---

# 62. Function

A **function** is a reusable block of code.

Example:

```ts
function add(a: number, b: number): number {
  return a + b;
}
```

A method is essentially a function associated with a class.

---

# 63. `void`

`void` usually means a function does not return a meaningful value.

Example:

```ts
protected toggleMenu(): void {
  ...
}
```

The method performs an action but does not return a value.

---

# 64. `null`

`null` means an intentional absence of a value.

Example:

```ts
let errorMessage: string | null = null;
```

This means the value can either be a string or intentionally have no value.

---

# 65. `undefined`

`undefined` generally means a value has not been assigned or does not exist.

Example:

```ts
let value: string | undefined;
```

The difference between `null` and `undefined` can become important when handling API data.

---

# 66. Error

An **error** represents something that went wrong.

For example:

```text
HTTP 401
HTTP 400
HTTP 500
network failure
validation failure
```

Angular allows code to react to errors through mechanisms such as:

```ts
error: (error) => {
  ...
}
```

---

# 67. HTTP Status Code

An HTTP status code describes the result of an HTTP request.

Common examples:

```text
200 → Success
201 → Created
400 → Bad Request
401 → Unauthorized
403 → Forbidden
404 → Not Found
500 → Server Error
```

For this project, `401` is particularly important because it can indicate that authentication is missing or expired.

---

# 68. Authentication vs Authorization

These terms are easy to confuse.

### Authentication

> "Who are you?"

Example:

```text
User successfully logged in.
```

### Authorization

> "Are you allowed to do this?"

Example:

```text
Authenticated user attempts an admin-only action.
```

Authentication and authorization are related but different security concepts.

---

# 69. State

**State** means information representing the current condition of the application.

Examples:

```text
isMenuOpen
isSubmitting
authenticated
loading
error
```

For example:

```ts
isMenuOpen = signal(false);
```

The current value of `isMenuOpen` is application/UI state.

---

# 70. Request State

**Request state** describes what is happening with an asynchronous request.

A common model is:

```text
idle
loading
success
error
```

For example:

```text
Button clicked
    ↓
loading
    ↓
API response
    ↓
success
```

or:

```text
Button clicked
    ↓
loading
    ↓
API error
    ↓
error
```

This is why the starter contains:

```text
core/state/
```

and:

```text
request-state-test/
```

---

# 71. Component Lifecycle

A component has a lifecycle.

Simplified:

```text
Component created
      ↓
Component initialized
      ↓
Component displayed/updated
      ↓
Component destroyed
```

Angular provides lifecycle hooks for situations where code needs to run at particular points.

Examples include:

```text
ngOnInit
ngOnDestroy
```

You do not need lifecycle hooks for every component.

Use them when there is a real lifecycle-related task.

---

# 72. Template Control Flow

Modern Angular supports template control flow such as:

```html
@if (isMenuOpen()) {
  <nav>
    ...
  </nav>
}
```

This means:

> Only render this section when the condition is true.

This is the modern Angular syntax for conditional rendering.

---

# 73. Component Composition

**Composition** means building larger UI pieces by combining smaller components.

For example:

```text
AppLayout
├── DashboardHeader
├── Menu
├── RouterOutlet
└── BottomNavigation
```

Rather than creating one enormous component, we compose smaller pieces.

This is one of the main ideas behind the starter's layout/design architecture.

---

# 74. Separation of Concerns

**Separation of concerns** means giving different parts of the application different responsibilities.

For example:

```text
AuthService
    → authentication API

AuthGuard
    → route access

AuthInterceptor
    → HTTP authentication behavior

AppLayout
    → application composition

DashboardHeader
    → header UI

Dashboard
    → dashboard page
```

Each part has a clear responsibility.

This makes the application easier to understand, test, and change.

---

# 75. Single Responsibility

This means:

> A piece of code should have one clear primary responsibility.

For example:

Good:

```text
AuthService
    → authentication operations
```

Less desirable:

```text
AuthService
    → authentication
    → rendering buttons
    → controlling menus
    → formatting dashboard cards
```

Keeping responsibilities separated prevents classes and components from becoming too large.

---

# 76. Beginner Mental Model

You don't need to memorize all of these terms.

For now, remember this simplified picture:

```text
                         ANGULAR APP
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
           Pages           Layouts            Core
             │                │                │
        actual screens    composition       infrastructure
             │                │                │
             │                ▼                ├── Services
             │             Designs             ├── Guards
             │                │                 ├── Interceptors
             │                │                 ├── Errors
             │                │                 └── State
             │                │
             └────────────────┘
                      │
                      ▼
                  shared/ui
                 small UI pieces
```

And for the reactive/async concepts:

```text
Signal
  ↓
Current reactive state

Observable
  ↓
Values/events over time

subscribe()
  ↓
Listen to an Observable

Promise
  ↓
One future result

async / await
  ↓
Work with Promises conveniently
```

For authentication:

```text
AuthService
    ↓
Authentication operations

AuthGuard
    ↓
Protect routes

AuthInterceptor
    ↓
Modify/handle HTTP requests

HttpOnly Cookies
    ↓
Browser-managed JWT storage

CSRF
    ↓
Protection for cookie-based state-changing requests

Django/DRF
    ↓
Final security authority
```

The most important thing is to understand **what responsibility each concept has**, rather than memorizing the terminology.

As you continue building the project, these terms will become much easier because you'll see the same concepts repeatedly in real code.
