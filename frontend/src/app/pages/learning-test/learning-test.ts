import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { LearningService } from '../../core/learning/services/learning.service';

import {
  HSKLevel,
  PaginatedStudyWords,
  QuizQuestion,
  QuizAnswerResult,
  UserProgress,
} from '../../core/learning/models/learning.models';


@Component({
  selector: 'app-learning-test',
  standalone: true,
  template: `
  
  <section>
    <h2>HSK Levels Test</h2>

    @if (hskLoading()) {
      <p>Loading HSK levels...</p>
    }

    @if (hskError()) {
      <p>{{ hskError() }}</p>
    }

    @if (hskLevels().length > 0) {
      <ul>
        @for (level of hskLevels(); track level.id) {
          <li>
            {{ level.name }}
            — order: {{ level.order }}
          </li>
        }
      </ul>
    }
  </section>


  <section>
    <h2>Study Words Test</h2>

    <button
      type="button"
      (click)="loadStudyWords(1, 1)"
    >
      Load HSK 1 — Page 1
    </button>

    <button
      type="button"
      (click)="loadStudyWords(1, 2)"
    >
      Load HSK 1 — Page 2
    </button>

    <button
      type="button"
      (click)="loadStudyWords(1, 6)"
    >
      Load HSK 1 — Page 6
    </button>

    @if (studyLoading()) {
      <p>Loading study words...</p>
    }

    @if (studyError()) {
      <p>{{ studyError() }}</p>
    }

    @if (studyWords(); as data) {
      <p>
        Total words: {{ data.count }}
      </p>

      <p>
        Page {{ data.page }} of {{ data.total_pages }}
      </p>

      <p>
        Words on this page: {{ data.results.length }}
      </p>

      <p>
        Previous page:
        {{ data.previous_page ?? 'None' }}
      </p>

      <p>
        Next page:
        {{ data.next_page ?? 'None' }}
      </p>

      <hr />

      @for (word of data.results; track word.id) {
        <div>
          <strong>{{ word.simplified }}</strong>
          — {{ word.pinyin }}
          — {{ word.meaning }}
        </div>
      }
    }
  </section>
  
  <h1>Learning Test</h1>

    <p>
      End-to-end test for the learning quiz and user progress.
    </p>

    <hr />

    <h2>Quiz</h2>

    @if (questionLoading()) {
      <p>Loading question...</p>
    }

    @if (questionError()) {
      <p>{{ questionError() }}</p>
    }

    @if (question() && !questionLoading()) {
      <p>
        <strong>Quiz type:</strong>
        {{ question()!.quiz_type }}
      </p>

      <h3>{{ question()!.prompt }}</h3>

      @for (option of question()!.options; track option) {
        <button
          type="button"
          (click)="submitAnswer(option)"
          [disabled]="
            answerLoading() || answerResult() !== null
          "
        >
          {{ option }}
        </button>

        <br /><br />
      }
    }

    @if (answerLoading()) {
      <p>Checking answer...</p>
    }

    @if (answerResult()) {
      <hr />

      @if (answerResult()!.correct) {
        <p>
          <strong>Correct!</strong>
        </p>
      } @else {
        <p>
          <strong>Incorrect.</strong>
        </p>
      }

      <p>
        Correct answer:
        <strong>
          {{ answerResult()!.correct_answer }}
        </strong>
      </p>

      <button
        type="button"
        (click)="loadQuestion()"
        [disabled]="questionLoading()"
      >
        Next Question
      </button>
    }

    <hr />

    <h2>User Progress</h2>

    @if (progressLoading()) {
      <p>Loading progress...</p>
    }

    @if (progressError()) {
      <p>{{ progressError() }}</p>
    }

    @if (!progressLoading() && !progressError()) {
      @if (progress().length === 0) {
        <p>No learning progress yet.</p>
      } @else {
        @for (item of progress(); track item.vocabulary_id) {
          <div>
            <strong>{{ item.simplified }}</strong>
            — {{ item.pinyin }}

            <br />

            Correct:
            {{ item.correct_count }}

            <br />

            Incorrect:
            {{ item.incorrect_count }}

            <br />

            Last reviewed:
            {{ item.last_reviewed_at || 'Never' }}

            <hr />
          </div>
        }
      }
    }
  `,
})
export class LearningTest implements OnInit {
  private learningService = inject(LearningService);

  hskLevels = signal<HSKLevel[]>([]);
  studyWords = signal<PaginatedStudyWords | null>(null);

  hskLoading = signal(false);
  studyLoading = signal(false);

  hskError = signal('');
  studyError = signal('');

  question = signal<QuizQuestion | null>(null);
  answerResult = signal<QuizAnswerResult | null>(null);

  progress = signal<UserProgress[]>([]);

  questionLoading = signal(false);
  answerLoading = signal(false);
  progressLoading = signal(false);

  questionError = signal('');
  progressError = signal('');

  ngOnInit(): void {
    this.loadHskLevels();
    this.loadQuestion();
    this.loadProgress();
  }


  loadHskLevels(): void {
    this.hskLoading.set(true);
    this.hskError.set('');

    this.learningService.getHskLevels().subscribe({
      next: (levels) => {
        this.hskLevels.set(levels);
        this.hskLoading.set(false);
      },
      error: () => {
        this.hskError.set(
          'Failed to load HSK levels.',
        );
        this.hskLoading.set(false);
      },
    });
  }


  loadStudyWords(
    hskLevel: number,
    page: number = 1,
  ): void {
    this.studyLoading.set(true);
    this.studyError.set('');

    this.learningService
      .getStudyWords(hskLevel, page)
      .subscribe({
        next: (result) => {
          this.studyWords.set(result);
          this.studyLoading.set(false);
        },
        error: () => {
          this.studyError.set(
            'Failed to load study words.',
          );
          this.studyLoading.set(false);
        },
      });
  }


  loadQuestion(): void {
    this.questionLoading.set(true);
    this.questionError.set('');
    this.answerResult.set(null);

    this.learningService
      .getQuizQuestion('hanzi_to_meaning')
      .subscribe({
        next: (question) => {
          this.question.set(question);
          this.questionLoading.set(false);
        },
        error: (error) => {
          console.error('Quiz question error:', error);

          this.questionError.set(
            'Failed to load quiz question.',
          );

          this.questionLoading.set(false);
        },
      });
  }

  submitAnswer(answer: string): void {
    const currentQuestion = this.question();

    if (!currentQuestion) {
      return;
    }

    this.answerLoading.set(true);

    this.learningService
      .submitQuizAnswer(
        currentQuestion.id,
        answer,
      )
      .subscribe({
        next: (result) => {
          this.answerResult.set(result);
          this.answerLoading.set(false);

          this.loadProgress();
        },
        error: (error) => {
          console.error('Quiz answer error:', error);

          this.answerLoading.set(false);
        },
      });
  }

  loadProgress(): void {
    this.progressLoading.set(true);
    this.progressError.set('');

    this.learningService
      .getUserProgress()
      .subscribe({
        next: (progress) => {
          this.progress.set(progress);
          this.progressLoading.set(false);
        },
        error: (error) => {
          console.error('Progress error:', error);

          this.progressError.set(
            'Failed to load learning progress.',
          );

          this.progressLoading.set(false);
        },
      });
  }
}