import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-centered-header',
  imports: [RouterLink],
  templateUrl: './centered-header.html',
  styleUrl: './centered-header.css',
})
export class CenteredHeader {
  readonly brand = input('Project App Starter');
}
