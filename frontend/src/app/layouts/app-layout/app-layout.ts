import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { DashboardHeader } from '../designs/app/headers/dashboard/dashboard-header/dashboard-header';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-app-layout',
  imports: [
    RouterLink,
    RouterOutlet,
    DashboardHeader,

  ],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
})
export class AppLayout {
  protected readonly isMenuOpen = signal(false);

  private authService = inject(AuthService);
  private router = inject(Router);
  
  protected toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },

      error: (error) => {
        console.error(
          'Logout error:',
          error,
        );

        this.router.navigate(['/login']);
      },
    });
  }

}
