import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-simple-footer',
  imports: [RouterLink],
  templateUrl: './simple-footer.html',
  styleUrl: './simple-footer.css',
})
export class SimpleFooter {
  readonly brand = input('Project App Starter');
  readonly year = input(new Date().getFullYear());
}
