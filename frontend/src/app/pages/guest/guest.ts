import { Component } from '@angular/core';

import {
  Router,
  RouterLink,
} from '@angular/router';

@Component({
  selector: 'app-guest',
  imports: [RouterLink],
  templateUrl: './guest.html',
  styleUrl: './guest.css',
})
export class Guest {
  constructor(
    private readonly router: Router,
  ) {}

  continueAsGuest(): void {
    void this.router.navigate(['/learning']);
  }
}
