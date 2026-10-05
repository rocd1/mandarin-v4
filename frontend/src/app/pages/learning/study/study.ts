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

import {
  HSKLevel,
  PaginatedStudyWords,
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  hskLevel = signal<number | null>(null);
  studyWords = signal<PaginatedStudyWords | null>(null);

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

    this.learningService
      .getStudyWords(level, page)
      .subscribe({
        next: (result) => {
          this.studyWords.set(result);
          this.loading.set(false);
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
}