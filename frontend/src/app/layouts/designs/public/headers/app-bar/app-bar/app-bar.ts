import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-app-bar',
  imports: [RouterLink],
  templateUrl: './app-bar.html',
  styleUrl: './app-bar.css',
})
export class AppBar {
  readonly brand = input('Project App Starter');

  protected readonly isMenuOpen = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
