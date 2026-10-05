import { Routes } from '@angular/router';


// ============================================================
// PUBLIC PAGES
// ============================================================

import { Landing } from './pages/landing/landing';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Guest } from './pages/guest/guest';

import { PublicLayout } from './layouts/public-layout/public-layout';


// ============================================================
// PROTECTED APPLICATION
// ============================================================

import { Dashboard } from './pages/dashboard/dashboard';

import { authGuard } from './core/guards/auth-guard';

import { AppLayout } from './layouts/app-layout/app-layout';


// ============================================================
// LEARNING
// ============================================================

import { HskSelection } from './pages/learning/hsk-selection/hsk-selection';
import { Study } from './pages/learning/study/study';
import { QuizSelection } from './pages/learning/quiz-selection/quiz-selection';
import { Quiz } from './pages/learning/quiz/quiz';

// ============================================================
// TEMPORARY DEVELOPER PAGES
// ============================================================

import { AuthTest } from './pages/auth-test/auth-test';
import { RequestStateTest } from './pages/request-state-test/request-state-test';
import { LearningTest } from './pages/learning-test/learning-test';


export const routes: Routes = [

  // ============================================================
  // LEARNING
  // ============================================================

  {
    path: 'learning',
    children: [
      {
        path: '',
        component: HskSelection,
      },
      {
        path: 'hsk/:level',
        component: Study,
      },
      {
        path: 'hsk/:level/quiz',
        component: QuizSelection,
      },
      {
        path: 'hsk/:level/quiz/:quizType',
        component: Quiz,
      },
    ],
  },


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

  {
    path: 'learning-test',
    component: LearningTest,
  },


  // ============================================================
  // FALLBACK
  // ============================================================

  {
    path: '**',
    redirectTo: '',
  },
];