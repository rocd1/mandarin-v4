import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hamburger-header',
  imports: [RouterLink],
  templateUrl: './hamburger-header.html',
  styleUrl: './hamburger-header.css',
})
export class HamburgerHeader {
  readonly brand = input('Project App Starter');

  protected readonly isMenuOpen = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
