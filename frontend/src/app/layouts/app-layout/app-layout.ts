import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

import { DashboardHeader } from '../designs/app/headers/dashboard/dashboard-header/dashboard-header';
import { AuthService } from '../../core/auth/services/auth.service';


@Component({
  selector: 'app-app-layout',
  imports: [
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    DashboardHeader,
  ],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
})
export class AppLayout {
  protected readonly isMenuOpen = signal(false);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  protected toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  
  protected logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },

      error: (error) => {
        console.error('Logout error:', error);
        this.router.navigate(['/login']);
      },
    });
  }
}
