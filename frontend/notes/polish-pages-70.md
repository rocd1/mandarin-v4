## Back to Home Button Navigation

### Purpose

The Back to Home button provides a consistent way for users to return to the appropriate home page based on their authentication status.

### Navigation Behavior

| User status        | Destination | Purpose                                             |
| ------------------ | ----------- | --------------------------------------------------- |
| Authenticated user | `/app`      | Returns to the authenticated application dashboard. |
| Guest user         | `/`         | Returns to the public landing page.                 |

### Implementation

The Study page uses `AuthStateService` to determine whether the user is authenticated.

```typescript
private readonly router = inject(Router);
private readonly authState = inject(AuthStateService);

protected goHome(): void {
  const isAuthenticated = this.authState.isAuthenticated;

  this.router.navigate([
    isAuthenticated ? '/app' : '/',
  ]);
}
```

The HTML button calls `goHome()` when clicked:

```html
<button
  type="button"
  class="back-button"
  (click)="goHome()"
>
  Back to Home
</button>
```

### Important Notes

* `isAuthenticated` is a getter, so access it without parentheses.
* `/app` is the authenticated dashboard route and is protected by the authentication guard.
* `/` is the public landing page in the current Angular route configuration.
* The same navigation pattern can be reused on other learning pages where users need to return home.
* Authentication state should be initialized and kept up to date by the existing authentication services.

### Manual Testing Checklist

* [ ] As a guest, open the Study page and click **Back to Home**. Confirm navigation to `/`.
* [ ] As an authenticated user, open the Study page and click **Back to Home**. Confirm navigation to `/app`.
* [ ] Confirm the authenticated dashboard remains protected by the authentication guard.
* [ ] Confirm guest users can continue accessing public learning pages.
