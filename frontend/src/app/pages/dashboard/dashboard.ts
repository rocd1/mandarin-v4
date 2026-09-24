import { Component, inject } from '@angular/core';

import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly authService = inject(AuthService);

  testProtectedEndpoint(): void {
    this.authService.testProtectedEndpoint().subscribe({
      next: (response) => {
        console.log('Protected endpoint:', response);
      },
      error: (error) => {
        console.error('Protected endpoint error:', error);
      },
    });
  }

  testConcurrentRequests(): void {
    console.log('Starting 3 concurrent protected requests...');

    this.authService.testProtectedEndpoint().subscribe({
      next: (response) => {
        console.log('Request A success:', response);
      },
      error: (error) => {
        console.error('Request A error:', error);
      },
    });

    this.authService.testProtectedEndpoint().subscribe({
      next: (response) => {
        console.log('Request B success:', response);
      },
      error: (error) => {
        console.error('Request B error:', error);
      },
    });

    this.authService.testProtectedEndpoint().subscribe({
      next: (response) => {
        console.log('Request C success:', response);
      },
      error: (error) => {
        console.error('Request C error:', error);
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