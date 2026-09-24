import { HttpErrorResponse } from '@angular/common/http';
import {
  Observable,
  catchError,
  map,
  of,
  startWith,
} from 'rxjs';

import { ApiErrorService } from '../errors/api-error.service';

import {
  RequestState,
} from './request-state';

export function toRequestState<T>(
  request$: Observable<T>,
  apiErrorService: ApiErrorService,
): Observable<RequestState<T>> {
  return request$.pipe(
    map((data): RequestState<T> => ({
      status: 'success',
      data,
    })),

    startWith<RequestState<T>>({
      status: 'loading',
    }),

    catchError((error: HttpErrorResponse) => {
      const apiError = apiErrorService.normalize(error);

      return of<RequestState<T>>({
        status: 'error',
        error: apiError,
      });
    }),
  );
}