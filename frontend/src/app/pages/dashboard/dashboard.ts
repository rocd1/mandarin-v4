import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from '../../core/auth/services/auth.service';

import { User } from '../../core/auth/models/auth.models';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);


  user = signal<User | null>(null);

  loading = signal(true);

  error = signal('');


  ngOnInit(): void {

    this.loadUser();

  }


  private loadUser(): void {

    this.loading.set(true);

    this.error.set('');


    this.authService
      .getCurrentUser()
      .subscribe({

        next: (user) => {

          this.user.set(user);

          this.loading.set(false);

        },

        error: (error) => {

          console.error(
            'Current user error:',
            error,
          );

          this.error.set(
            'Failed to load your account information.',
          );

          this.loading.set(false);

        },

      });

  }


  goToStudy(): void {

    this.router.navigate([
      '/learning',
    ]);

  }


  goToQuiz(): void {

    this.router.navigate([
      '/learning',
    ]);

  }

}