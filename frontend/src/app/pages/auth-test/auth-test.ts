import { Component, inject } from '@angular/core';

import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-auth-test',
  standalone: true,
  templateUrl: './auth-test.html',
  styleUrl: './auth-test.css',
})
export class AuthTest {
  private readonly authService = inject(AuthService);

  message = 'Ready to test authentication.';

  testLogin(): void {
    this.message = 'Testing login...';

    this.authService.login({
      username: 'superadmin-1',
      password: 'superpassword1',
    }).subscribe({
      next: (response) => {
        console.log('LOGIN SUCCESS:', response);

        this.message = response.message;
      },
      error: (error) => {
        console.error('LOGIN ERROR:', error);

        this.message =
          error?.error?.detail ??
          error?.error?.message ??
          'Login failed.';
      },
    });
  }

  testCurrentUser(): void {
    this.message = 'Checking current user...';

    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        console.log('CURRENT USER:', user);

        this.message =
          `Authenticated as ${user.username}`;
      },
      error: (error) => {
        console.error('CURRENT USER ERROR:', error);

        this.message =
          'No authenticated user.';
      },
    });
  }

  testLogout(): void {
    this.message = 'Testing logout...';

    this.authService.logout().subscribe({
      next: (response) => {
        console.log('LOGOUT SUCCESS:', response);

        this.message = response.message;
      },
      error: (error) => {
        console.error('LOGOUT ERROR:', error);

        this.message = 'Logout failed.';
      },
    });
  }


  testUnauthenticatedMe(): void {
    this.authService.getCurrentUser().subscribe({
      next: (response) => {
        console.log('Unexpected success:', response);
      },
      error: (error) => {
        console.log('ME status:', error.status);
        console.log('ME response body:', error.error);
        console.log('Full ME error:', error);
      },
    });
  }



}