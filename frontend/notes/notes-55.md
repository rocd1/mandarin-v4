## 55. Register Page — Request State & API Error Handling

Our Register page has been updated to use the reusable RequestState pattern for handling asynchronous API requests and error normalization.

# Current Implementation
```
frontend/src/app/core/state/
├── request-state.ts
└── request-state.utils.ts
```
```
frontend/src/app/core/errors/
└── api-error.service.ts
```

Responsibilities
```
request-state.ts
    → defines reusable request state types
```

request-state.utils.ts
    → converts Observable results/errors into RequestState<T>

api-error.service.ts
    → normalizes backend HTTP errors into a consistent format

Register component
    → applies RequestState to UI rendering and form controls


## 55.1 Request States
The Register page now supports four states:

```
idle     → no request started
loading  → request in progress
success  → account successfully created
error    → API request failed
```

Conversion example:
```
typescript
toRequestState(
  this.authService.register(formValue),
  this.apiErrorService,
)
```


## 55.2 Validation Layers

Local Validation
Username required

Email required + valid format

Password required + min 8 chars

Confirmation password required + must match

Invalid forms are blocked:

typescript
```
if (this.registerForm.invalid) {
  this.registerForm.markAllAsTouched();
  return;
}
```

Server-Side Validation
Django/DRF backend is authoritative

Field errors → mapped to Angular form controls

Non-field errors → normalized into ApiError.message

Example backend response:

json
```
{
  "username": ["A user with that username already exists."],
  "email": ["This field may not be blank."]
}
```


## 55.3 Loading State

While submitting:

```
Create Account
        ↓
Creating account...
The button is disabled:
```

```
html
[disabled]="requestState().status === 'loading'"
```


## 55.4 Architectural Flow

```
Angular Form
    ↓ Local validation
    ↓ AuthService
    ↓ Django/DRF API
    ↓ ApiErrorService
    ↓ RequestState
    ↓ Register UI
```

Angular form → user input & immediate validation

AuthService → HTTP communication

Django/DRF → authoritative validation & business rules

ApiErrorService → normalize API errors

RequestState → represent idle/loading/success/error states

Register component → decide how states are displayed

This pattern is reusable for other pages like Login, Profile, and future features.

## 55.5 Learning Checkpoint


We have verified:

```
RequestState<T> integration        ✅
Local validation rules             ✅
Server-side validation handling    ✅
Field-specific error mapping       ✅
Form-level error messages          ✅
Loading state feedback             ✅
Button disabled during submission  ✅
Successful registration flow       ✅
```

The Register implementation is considered working before moving on to the Login page.