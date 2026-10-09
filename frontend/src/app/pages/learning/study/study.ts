import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { LearningService } from '../../../core/learning/services/learning.service';

import { AuthStateService } from '../../../core/auth/services/auth-state';


import {
  PaginatedStudyWords, 
  UserProgress,
} from '../../../core/learning/models/learning.models';


@Component({
  selector: 'app-study',
  standalone: true,
  imports: [],
  templateUrl: './study.html',
  styleUrl: './study.css',
})
export class Study implements OnInit {
  private learningService = inject(LearningService);
  private authStateService = inject(AuthStateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private readonly authState = inject(AuthStateService);

  protected goHome(): void {
    const isAuthenticated = this.authState.isAuthenticated;

    this.router.navigate([
      isAuthenticated ? '/app' : '/',
    ]);
  }


  hskLevel = signal<number | null>(null);

  studyWords = signal<PaginatedStudyWords | null>(null);

  userProgress = signal<UserProgress[]>([]);

  flippedCards = signal<Set<number>>(
    new Set(),
  );

  loading = signal(false);
  error = signal('');

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
      this.error.set('Invalid HSK level.');
      return;
    }

    this.hskLevel.set(level);

    this.loadWords(1);
  }

  loadWords(page: number): void {
    const level = this.hskLevel();

    if (level === null) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.flippedCards.set(new Set());

    this.learningService
      .getStudyWords(level, page)
      .subscribe({
        next: (result) => {
          this.studyWords.set(result);


          if (!this.authStateService.isAuthenticated) {
            this.userProgress.set([]);
            this.loading.set(false);
            return;
          }

          this.learningService
            .getUserProgress()
            .subscribe({
              next: (progress) => {
                this.userProgress.set(progress);
                this.loading.set(false);
              },

              error: (error) => {
                console.error(
                  'User progress error:',
                  error,
                );

                this.userProgress.set([]);
                this.loading.set(false);
              },
            });

          this.learningService
            .getUserProgress()
            .subscribe({
              next: (progress) => {
                this.userProgress.set(progress);
                this.loading.set(false);
              },

              error: (error) => {
                console.error(
                  'User progress error:',
                  error,
                );

                this.userProgress.set([]);
                this.loading.set(false);
              },
            });
        },

        error: (error) => {
          console.error(
            'Study vocabulary error:',
            error,
          );

          this.error.set(
            'Failed to load study vocabulary.',
          );

          this.loading.set(false);
        },
      });
  }

  getStudiedCount(): number {
    const level = this.hskLevel();

    if (level === null) {
      return 0;
    }

    return this.userProgress().filter(
      progress => progress.hsk_level === level,
    ).length;
  }

  getProgressPercentage(): number {
    const data = this.studyWords();

    if (!data || data.count === 0) {
      return 0;
    }

    return Math.round(
      (this.getStudiedCount() / data.count) * 100,
    );
  }




  toggleCard(wordId: number): void {
    this.flippedCards.update(
      cards => {
        const updatedCards = new Set(cards);

        if (updatedCards.has(wordId)) {
          updatedCards.delete(wordId);
        } else {
          updatedCards.add(wordId);
        }

        return updatedCards;
      },
    );
  }

  isCardFlipped(wordId: number): boolean {
    return this.flippedCards().has(wordId);
  }

  nextPage(): void {
    const data = this.studyWords();

    if (
      data?.next_page !== null &&
      data?.next_page !== undefined
    ) {
      this.loadWords(data.next_page);
    }
  }

  previousPage(): void {
    const data = this.studyWords();

    if (
      data?.previous_page !== null &&
      data?.previous_page !== undefined
    ) {
      this.loadWords(data.previous_page);
    }
  }

  backToHskSelection(): void {
    this.router.navigate([
      '/learning',
    ]);
  }

  startQuiz(): void {
    const level = this.hskLevel();

    if (level === null) {
      return;
    }

    this.router.navigate([
      '/learning/hsk',
      level,
      'quiz',
    ]);
  }

  isAuthenticated(): boolean {
    return this.authStateService.isAuthenticated;
  }

}