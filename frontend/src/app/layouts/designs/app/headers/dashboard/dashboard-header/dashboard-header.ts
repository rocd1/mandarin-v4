import { Component, input, output } from '@angular/core'; 
import { RouterLink } from '@angular/router'; 

@Component({ 
  selector: 'app-dashboard-header', 
  imports: [RouterLink], 
  templateUrl: './dashboard-header.html', 
  styleUrl: './dashboard-header.css',
}) 
 
export class DashboardHeader { 
  readonly title = input('Dashboard'); 
  readonly menuToggle = output<void>(); 
  protected toggleMenu(): void { 
    this.menuToggle.emit(); 
  } 
}