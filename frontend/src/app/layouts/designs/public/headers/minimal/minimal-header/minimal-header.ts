import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-minimal-header',
  imports: [RouterLink],
  templateUrl: './minimal-header.html',
  styleUrl: './minimal-header.css',
})
export class MinimalHeader {
  readonly brand = input('Project App Starter');
}
