import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar-navigation.html',
  styleUrl: './sidebar-navigation.css',
})
export class SidebarNavigation {
  readonly brand = input('PROJECT APP');
}



