import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-app-bar',
  imports: [],
  templateUrl: './app-bar.html',
  styleUrl: './app-bar.css',
})
export class AppBar {
  readonly title = input('PROJECT APP');

  readonly menuOpen = input(false);

  readonly menuToggle = output<void>();
  readonly search = output<void>();

  protected toggleMenu(): void {
    this.menuToggle.emit();
  }

  protected searchClicked(): void {
    this.search.emit();
  }
}
