import { Routes } from '@angular/router';

import { Landing } from './pages/landing/landing';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Guest } from './pages/guest/guest';

import { AuthTest } from './pages/auth-test/auth-test';
import { RequestStateTest } from './pages/request-state-test/request-state-test';

import { Dashboard } from './pages/dashboard/dashboard';

import { authGuard } from './core/guards/auth-guard';

import { PublicLayout } from './layouts/public-layout/public-layout';
import { AppLayout } from './layouts/app-layout/app-layout';


export const routes: Routes = [

  // ============================================================
  // PROTECTED APPLICATION
  // ============================================================

  {
    path: 'app',
    component: AppLayout,
    canActivate: [authGuard],

    children: [
      {
        path: '',
        component: Dashboard,
      },
    ],
  },

  // ============================================================
  // PUBLIC PAGES
  // ============================================================

  {
    path: '',
    component: PublicLayout,

    children: [
      {
        path: '',
        component: Landing,
      },
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'register',
        component: Register,
      },
      {
        path: 'guest',
        component: Guest,
      },
    ],
  },

  // ============================================================
  // TEMPORARY DEVELOPER PAGES
  // ============================================================

  {
    path: 'auth-test',
    component: AuthTest,
  },

  {
    path: 'request-state-test',
    component: RequestStateTest,
  },

  // ============================================================
  // FALLBACK
  // ============================================================

  {
    path: '**',
    redirectTo: '',
  },
];