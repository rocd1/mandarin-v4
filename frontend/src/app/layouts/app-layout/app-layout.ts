import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { DashboardHeader } from '../designs/app/headers/dashboard/dashboard-header/dashboard-header';


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

  protected toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }
}
