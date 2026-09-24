// ============================================================
// USER
// ============================================================

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}


// ============================================================
// LOGIN
// ============================================================

export interface LoginRequest {
  username: string;
  password: string;
}


// ============================================================
// REGISTER
// ============================================================

export interface RegisterRequest {
  username: string;
  email?: string;
  password: string;
  password_confirm: string;
}


// ============================================================
// CHANGE PASSWORD
// ============================================================

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}


// ============================================================
// CSRF
// ============================================================

export interface CsrfResponse {
  csrfToken: string;
}


// ============================================================
// BASIC API RESPONSE
// ============================================================

export interface ApiMessageResponse {
  message: string;
}