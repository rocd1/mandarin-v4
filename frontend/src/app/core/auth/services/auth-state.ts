import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  of,
  tap,
  throwError,
} from 'rxjs';

import { AuthService } from './auth.service';
import { User } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private readonly authService = inject(AuthService);

  private readonly currentUserSubject =
    new BehaviorSubject<User | null>(null);

  readonly currentUser$: Observable<User | null> =
    this.currentUserSubject.asObservable();

  private initialized = false;

  initialize(): Observable<User | null> {
    if (this.initialized) {
      return of(this.currentUserSubject.value);
    }

    return this.authService.getCurrentUser().pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
        this.initialized = true;
      }),

      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.currentUserSubject.next(null);
          this.initialized = true;

          return of(null);
        }

        return throwError(() => error);
      }),
    );
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  setUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  clearUser(): void {
    this.currentUserSubject.next(null);
  }
}