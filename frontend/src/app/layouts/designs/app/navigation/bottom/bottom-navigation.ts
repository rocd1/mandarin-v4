import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-bottom-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-navigation.html',
  styleUrl: './bottom-navigation.css',
})
export class BottomNavigation {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

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
