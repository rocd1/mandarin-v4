import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-simple-app-header',
  imports: [RouterLink],
  templateUrl: './simple-header.html',
  styleUrl: './simple-header.css',
})
export class SimpleAppHeader {
  readonly brand = input('PROJECT APP');
}
