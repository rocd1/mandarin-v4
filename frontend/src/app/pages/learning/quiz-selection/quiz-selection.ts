import {
  Component,
  OnInit,
  inject,
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { AuthStateService } from '../../../core/auth/services/auth-state';



@Component({
  selector: 'app-quiz-selection',
  standalone: true,
  imports: [],
  templateUrl: './quiz-selection.html',
  styleUrl: './quiz-selection.css',
})
export class QuizSelection implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private readonly authState = inject(AuthStateService);
  
  protected goHome(): void {
    const isAuthenticated = this.authState.isAuthenticated;
  
    this.router.navigate([
      isAuthenticated ? '/app' : '/',
    ]);
  }


  hskLevel: number | null = null;

  ngOnInit(): void {
    const levelValue = this.route.snapshot.paramMap.get(
      'level',
    );

    const level = Number(levelValue);

    if (
      !levelValue ||
      !Number.isInteger(level) ||
      level < 1 ||
      level > 7
    ) {
      this.router.navigate([
        '/learning',
      ]);

      return;
    }

    this.hskLevel = level;
  }

  selectQuizType(
    quizType: string,
  ): void {
    if (this.hskLevel === null) {
      return;
    }

    this.router.navigate([
      '/learning/hsk',
      this.hskLevel,
      'quiz',
      quizType,
    ]);
  }

  backToStudy(): void {
    if (this.hskLevel === null) {
      this.router.navigate([
        '/learning',
      ]);

      return;
    }

    this.router.navigate([
      '/learning/hsk',
      this.hskLevel,
    ]);
  }

  backToHskSelection(): void {
    this.router.navigate([
      '/learning',
    ]);
  }

}