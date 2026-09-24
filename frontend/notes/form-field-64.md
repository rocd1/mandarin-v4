### 5.9.3 Reusable FormField Component

The starter includes a small reusable `FormField` UI component for consistent form-field presentation.

**Location:**

```text
src/app/shared/ui/form-field/
├── form-field.ts
├── form-field.html
├── form-field.css
└── form-field.spec.ts
```

#### Purpose

`FormField` provides the shared presentation structure for a form field:

* Label
* Projected form control
* Projected validation or help messages
* Consistent field spacing
* Consistent label styling
* Consistent validation-message styling

The component is intentionally kept independent of Angular Reactive Forms.

#### API

The initial component exposes two required inputs:

```ts
readonly label = input.required<string>();
readonly inputId = input.required<string>();
```

| Input     | Purpose                                                   |
| --------- | --------------------------------------------------------- |
| `label`   | Text displayed by the field label                         |
| `inputId` | ID used to associate the label with the projected control |

Example:

```html
<app-form-field
  label="Username"
  inputId="username"
>
  <input
    id="username"
    type="text"
    formControlName="username"
    autocomplete="username"
  />

  @if (...) {
    <small>Username is required.</small>
  }
</app-form-field>
```

#### Content Projection

The actual form control is projected into `FormField` using Angular content projection.

This allows the component to work with different types of controls without knowing anything about Angular Forms.

For example:

```html
<app-form-field label="Email" inputId="email">
  <input
    id="email"
    type="email"
    formControlName="email"
    autocomplete="email"
  />
</app-form-field>
```

The component does **not** receive or manage a `FormControl`.

Form logic remains responsible for:

* Reactive Form configuration
* Validators
* `touched` state
* Validation conditions
* Server-side validation errors
* Choosing which validation message to display

`FormField` is responsible only for presenting those elements consistently.

#### Design Principle

The shared component follows a clear separation of responsibilities:

```text
Form / Page
    │
    ├── FormGroup
    ├── FormControl
    ├── Validators
    ├── Validation logic
    └── Error messages
             │
             ▼
       FormField
             │
             ├── Label
             ├── Projected control
             └── Projected messages
```

This keeps `FormField` reusable across different forms and avoids coupling the shared UI layer to a specific form implementation.

#### Initial Scope

The first version intentionally does **not** include additional APIs such as:

* `FormControl` inputs
* Required-state handling
* Error-state handling
* Placeholder configuration
* Input type configuration
* Disabled-state handling
* Help-text inputs
* Custom error-message inputs

These can be introduced later if a real repeated requirement appears.

The goal is to keep shared components small and reusable rather than adding configuration before it is needed.

#### Accessibility

`FormField` uses the `inputId` input to associate its `<label>` with the projected form control:

```html
<label [for]="inputId()">
  {{ label() }}
</label>
```

The projected control must use the same `id` value:

```html
<input id="username" />
```

This preserves the normal HTML label/control relationship.

#### Current Adoption

`FormField` is initially being introduced into the authentication forms, beginning with the Login page.

The component will be migrated incrementally and tested before replacing the existing field markup throughout the application.

#### Testing

Before migrating the existing forms, the component should be verified to:

* Render the supplied label
* Associate the label with the supplied `inputId`
* Render projected content correctly
* Preserve projected Angular form controls
* Display projected validation messages
* Maintain the expected field spacing and styling

The component intentionally remains small until additional reusable requirements are identified.
