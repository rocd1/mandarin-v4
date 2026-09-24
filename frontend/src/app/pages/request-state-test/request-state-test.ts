import {
  Component,
  inject,
  signal,
} from '@angular/core';

import {
  Observable,
  of,
  delay,
  throwError,
} from 'rxjs';

import { ApiErrorService } from '../../core/errors/api-error.service';

import {
  RequestState,
} from '../../core/state/request-state';

import {
  toRequestState,
} from '../../core/state/request-state.utils';

import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-request-state-test',
  templateUrl: './request-state-test.html',
  styleUrl: './request-state-test.css',
})
export class RequestStateTest {
  private readonly apiErrorService =
    inject(ApiErrorService);

  protected readonly requestState =
    signal<RequestState<string>>({
      status: 'idle',
    });

  protected testSuccess(): void {
    const request$: Observable<string> = of(
      'Test request succeeded!',
    ).pipe(
      delay(1000),
    );

    toRequestState(
      request$,
      this.apiErrorService,
    ).subscribe((state) => {

      this.requestState.set(state);
    });
  }

  protected testError(): void {
    const request$: Observable<string> =
        throwError(
        () =>
            new HttpErrorResponse({
            status: 500,
            error: {
                detail: 'Test server error.',
            },
            }),
        ).pipe(
        delay(1000),
        );

    toRequestState(
        request$,
        this.apiErrorService,
    ).subscribe((state) => {
        this.requestState.set(state);
    });
    }

}