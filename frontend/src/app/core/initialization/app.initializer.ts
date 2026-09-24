import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthStateService } from '../auth/services/auth-state';
import { CsrfService } from '../auth/services/csrf.service';

export function initializeApp(): Promise<void> {
  const csrfService = inject(CsrfService);
  const authStateService = inject(AuthStateService);

  return firstValueFrom(
    csrfService.initialize(),
  ).then(() => {
    return firstValueFrom(
      authStateService.initialize(),
    );
  }).then(() => undefined);
}