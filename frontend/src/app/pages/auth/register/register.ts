import { Component, inject, signal } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { ApiErrorService } from '../../../core/errors/api-error.service';
import { AuthService } from '../../../core/auth/services/auth.service';

import { ApiMessageResponse } from '../../../core/auth/models/auth.models';

import { RequestState } from '../../../core/state/request-state';

import { toRequestState } from '../../../core/state/request-state.utils';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly router = inject(Router);

  protected readonly registerForm = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirm: ['', [Validators.required]],
    },
    {
      validators: [passwordMatchValidator],
    },
  );

  protected readonly requestState =
    signal<RequestState<ApiMessageResponse>>({
      status: 'idle',
    });

  protected submit(): void {
    this.clearServerErrors();

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.getRawValue();

    toRequestState(
      this.authService.register(formValue),
      this.apiErrorService,
    ).subscribe((state) => {
      this.requestState.set(state);

      if (state.status === 'success') {
        void this.router.navigate(['/login']);
        return;
      }

      if (state.status === 'error') {
        this.applyFieldErrors(state.error.fieldErrors);
      }
    });
  }

  private applyFieldErrors(
    fieldErrors: Record<string, string[]>,
  ): void {
    for (const [fieldName, messages] of Object.entries(fieldErrors)) {
      const control = this.registerForm.get(fieldName);

      if (!control || messages.length === 0) {
        continue;
      }

      control.setErrors({
        ...control.errors,
        server: messages[0],
      });

      control.markAsTouched();
    }
  }

  private clearServerErrors(): void {
    for (const control of Object.values(this.registerForm.controls)) {
      if (!control.errors?.['server']) {
        continue;
      }

      const errors = { ...control.errors };
      delete errors['server'];

      control.setErrors(
        Object.keys(errors).length > 0 ? errors : null,
      );
    }
  }
}


function passwordMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const password = control.get('password')?.value;
  const passwordConfirm = control.get('password_confirm')?.value;

  if (password === passwordConfirm) {
    return null;
  }

  return {
    passwordMismatch: true,
  };
}
