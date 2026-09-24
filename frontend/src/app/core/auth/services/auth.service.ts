import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../../config/api.config';

import {
  ApiMessageResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../models/auth.models';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    `${API_CONFIG.baseUrl}/api/auth`;


  // ==========================================================
  // LOGIN
  // ==========================================================

  login(
    credentials: LoginRequest,
  ): Observable<ApiMessageResponse> {

    return this.http.post<ApiMessageResponse>(
      `${this.baseUrl}/login/`,
      credentials,
      {
        withCredentials: true,
      },
    );
  }


  // ==========================================================
  // REGISTER
  // ==========================================================

  register(
    data: RegisterRequest,
  ): Observable<ApiMessageResponse> {

    return this.http.post<ApiMessageResponse>(
      `${this.baseUrl}/register/`,
      data,
      {
        withCredentials: true,
      },
    );
  }


  // ==========================================================
  // LOGOUT
  // ==========================================================

  logout(): Observable<ApiMessageResponse> {

    return this.http.post<ApiMessageResponse>(
      `${this.baseUrl}/logout/`,
      {},
      {
        withCredentials: true,
      },
    );
  }


  // ==========================================================
  // REFRESH TOKEN
  // ==========================================================

  refresh(): Observable<ApiMessageResponse> {

    return this.http.post<ApiMessageResponse>(
      `${this.baseUrl}/refresh/`,
      {},
      {
        withCredentials: true,
      },
    );
  }


  // ==========================================================
  // CURRENT USER
  // ==========================================================

  getCurrentUser(): Observable<User> {

    return this.http.get<User>(
      `${this.baseUrl}/me/`,
      {
        withCredentials: true,
      },
    );
  }



  testProtectedEndpoint(): Observable<ApiMessageResponse> {
    return this.http.get<ApiMessageResponse>(
      `${API_CONFIG.baseUrl}/api/test/protected/`,
      { withCredentials: true },
    );
  }

  
}