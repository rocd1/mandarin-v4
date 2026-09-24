import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { API_CONFIG } from '../../config/api.config';

import { CsrfResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class CsrfService {
  private readonly http = inject(HttpClient);

  private readonly csrfUrl =
    `${API_CONFIG.baseUrl}/api/auth/csrf/`;

  private csrfToken: string | null = null;

  initialize(): Observable<CsrfResponse> {
    return this.http.get<CsrfResponse>(
      this.csrfUrl,
      {
        withCredentials: true,
      },
    ).pipe(
      tap((response) => {
        this.csrfToken = response.csrfToken;
      }),
    );
  }

  getToken(): string | null {
    return this.csrfToken;
  }
}