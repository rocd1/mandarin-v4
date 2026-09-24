import { Component, inject, signal } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { switchMap } from 'rxjs';

import { AuthService } from '../../../core/auth/services/auth.service';
import { AuthStateService } from '../../../core/auth/services/auth-state';
import { ApiErrorService } from '../../../core/errors/api-error.service';

import { User } from '../../../core/auth/models/auth.models';

import { RequestState } from '../../../core/state/request-state';

import { toRequestState } from '../../../core/state/request-state.utils';

import { Button } from '../../../shared/ui/button/button';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Button],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authStateService = inject(AuthStateService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly router = inject(Router);

  protected readonly loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  protected readonly requestState =
    signal<RequestState<User>>({
      status: 'idle',
    });

  protected submit(): void {
    if (this.requestState().status === 'loading') {
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formValue = this.loginForm.getRawValue();

    toRequestState(
      this.authService.login(formValue).pipe(
        switchMap(() =>
          this.authService.getCurrentUser(),
        ),
      ),
      this.apiErrorService,
    ).subscribe((state) => {
      this.requestState.set(state);

      if (state.status === 'success') {
        this.authStateService.setUser(state.data);
        void this.router.navigate(['/app']);
      }
    });
  }
}
