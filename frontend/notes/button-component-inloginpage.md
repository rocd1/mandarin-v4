### 5.9.2 Reusable Button Component

Created the first reusable shared UI component:

```text
src/app/shared/ui/button/
├── button.ts
├── button.html
├── button.css
└── button.spec.ts
```

#### Purpose

The `Button` component provides a consistent, reusable style and behavior for native HTML buttons across the application.

The component keeps common button presentation in one place while allowing individual pages to control the button's purpose and action.

#### Supported inputs

The component currently supports:

* `type` — `button`, `submit`, or `reset`
* `variant` — `primary` or `secondary`
* `disabled` — enables or disables the native button

Example:

```html
<app-button
  type="submit"
  variant="primary"
  [disabled]="isSubmitting"
>
  Sign In
</app-button>
```

#### Current button theme

**Primary**

* Black background
* White text
* Blue background on hover
* Blue focus outline
* Reduced opacity when disabled

**Secondary**

* White background
* Dark text
* Light border
* Subtle gray hover state

#### Content projection

The component uses Angular content projection so the calling component controls the button's displayed text or content:

```html
<app-button type="submit">
  Sign In
</app-button>
```

This allows the same component to display different labels such as:

```text
Sign In
Signing in...
Create Account
Save
Continue
```

#### Semantic HTML

The reusable Button component is intended for **actions**, such as:

* submitting a form
* saving data
* deleting data
* triggering an application action

Navigation continues to use semantic links:

```html
<a routerLink="/login">Sign In</a>
```

Even when a link is styled to look like a button, it should remain an `<a>` when its purpose is navigation.

This distinction keeps the starter accessible and semantically correct.

#### First adoption

The Login page was migrated from a page-specific native submit button to the reusable Button component.

Before:

```html
<button
  type="submit"
  class="submit-button"
  [disabled]="requestState().status === 'loading'"
>
  Sign In
</button>
```

After:

```html
<app-button
  type="submit"
  variant="primary"
  [disabled]="requestState().status === 'loading'"
>
  {{
    requestState().status === 'loading'
      ? 'Signing in...'
      : 'Sign In'
  }}
</app-button>
```

The Login flow was tested after migration, including:

* Button rendering
* Form submission
* Disabled state
* Loading text
* Successful login
* `/me/` authentication
* Navigation to `/app`
* Protected endpoint access

#### Current scope

The Button component intentionally remains small.

Features such as loading indicators, icons, full-width behavior, danger variants, and additional button sizes can be added later when the starter has a real requirement for them.

Reusable UI components should grow from repeated application needs rather than from a predefined checklist.
