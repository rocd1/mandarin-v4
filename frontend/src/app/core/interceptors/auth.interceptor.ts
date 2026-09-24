import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  Observable,
  catchError,
  finalize,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';

import { AuthService } from '../auth/services/auth.service';
import { AuthStateService } from '../auth/services/auth-state';
import { CsrfService } from '../auth/services/csrf.service';

let refreshRequest$: Observable<unknown> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfService = inject(CsrfService);
  const authService = inject(AuthService);
  const authStateService = inject(AuthStateService);

  const modifiedRequest = addRequestHeaders(req, csrfService);

  return next(modifiedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      if (!shouldRefresh(req.url)) {
        return throwError(() => error);
      }

      return refreshAccessToken(authService).pipe(
        switchMap(() => {
          return next(modifiedRequest);
        }),

        catchError((refreshError: HttpErrorResponse) => {
          if (refreshError.status === 401) {
            authStateService.clearUser();
          }

          return throwError(() => refreshError);
        }),
      );
    }),
  );
};


function addRequestHeaders(
  req: HttpRequest<unknown>,
  csrfService: CsrfService,
): HttpRequest<unknown> {
  let modifiedRequest = req.clone({
    withCredentials: true,
  });

  const isStateChangingRequest = [
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
  ].includes(req.method.toUpperCase());

  if (isStateChangingRequest) {
    const csrfToken = csrfService.getToken();

    if (csrfToken) {
      modifiedRequest = modifiedRequest.clone({
        setHeaders: {
          'X-CSRFToken': csrfToken,
        },
      });
    }
  }

  return modifiedRequest;
}


function shouldRefresh(url: string): boolean {
  const excludedEndpoints = [
    '/api/auth/login/',
    '/api/auth/register/',
    '/api/auth/logout/',
    '/api/auth/refresh/',
    '/api/auth/csrf/',
    '/api/auth/me/',
  ];

  return !excludedEndpoints.some((endpoint) =>
    url.includes(endpoint),
  );
}


function refreshAccessToken(
  authService: AuthService,
): Observable<unknown> {
  if (!refreshRequest$) {
    refreshRequest$ = authService.refresh().pipe(
      shareReplay(1),

      finalize(() => {
        refreshRequest$ = null;
      }),
    );
  }

  return refreshRequest$;
}