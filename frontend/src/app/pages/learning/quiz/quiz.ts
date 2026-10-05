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
  QuizQuestion,
} from '../../../core/learning/models/learning.models';


interface QuizResult {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  correct: boolean;
}


@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements OnInit {
  private learningService = inject(LearningService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);


  hskLevel = signal<number | null>(null);
  quizType = signal<string>('');

  questions = signal<QuizQuestion[]>([]);
  currentQuestionIndex = signal(0);

  selectedAnswer = signal<string | null>(null);
  submitted = signal(false);

  correctCount = signal(0);
  incorrectCount = signal(0);

  results = signal<QuizResult[]>([]);

  loading = signal(false);
  error = signal('');


  ngOnInit(): void {
    const levelValue =
      this.route.snapshot.paramMap.get(
        'level',
      );

    const quizType =
      this.route.snapshot.paramMap.get(
        'quizType',
      );

    const level = Number(levelValue);

    const validQuizTypes = [
      'hanzi_to_meaning',
      'meaning_to_hanzi',
      'hanzi_to_pinyin',
      'pinyin_to_hanzi',
    ];

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

    if (
      !quizType ||
      !validQuizTypes.includes(quizType)
    ) {
      this.router.navigate([
        '/learning/hsk',
        level,
        'quiz',
      ]);

      return;
    }

    this.hskLevel.set(level);
    this.quizType.set(quizType);

    this.loadQuiz();
  }


  loadQuiz(): void {
    const level = this.hskLevel();
    const quizType = this.quizType();

    if (
      level === null ||
      !quizType
    ) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.questions.set([]);
    this.currentQuestionIndex.set(0);

    this.selectedAnswer.set(null);
    this.submitted.set(false);

    this.correctCount.set(0);
    this.incorrectCount.set(0);
    this.results.set([]);

    const requests = Array.from(
      { length: 10 },
      () =>
        this.learningService.getQuizQuestion(
          level,
          quizType,
        ),
    );

    this.learningService
      .getQuizQuestions(
        level,
        quizType,
      )
      .subscribe({
        next: (response) => {
          this.questions.set(
            response.questions,
          );

          this.loading.set(false);
        },

        error: (error) => {
          console.error(
            'Quiz loading error:',
            error,
          );

          this.error.set(
            'Failed to load quiz questions.',
          );

          this.loading.set(false);
        },
      });
      
  }


  get currentQuestion(): QuizQuestion | null {
    const questions = this.questions();

    return (
      questions[
        this.currentQuestionIndex()
      ] ?? null
    );
  }


  get isComplete(): boolean {
    return (
      this.questions().length === 10 &&
      this.currentQuestionIndex() >= 10
    );
  }


  selectAnswer(answer: string): void {
    if (this.submitted()) {
      return;
    }

    this.selectedAnswer.set(answer);
  }


  submitAnswer(): void {
    const question = this.currentQuestion;
    const answer = this.selectedAnswer();

    if (
      !question ||
      !answer ||
      this.submitted()
    ) {
      return;
    }

    this.submitted.set(true);

    this.learningService
      .submitQuizAnswer(
        question.id,
        answer,
      )
      .subscribe({
        next: (result) => {
          if (result.correct) {
            this.correctCount.update(
              count => count + 1,
            );
          } else {
            this.incorrectCount.update(
              count => count + 1,
            );
          }

          this.results.update(
            results => [
              ...results,
              {
                question: question.prompt,
                yourAnswer: answer,
                correctAnswer: result.correct_answer,
                correct: result.correct,
              },
            ],
          );
        },

        error: (error) => {
          console.error(
            'Quiz answer error:',
            error,
          );

          this.error.set(
            'Failed to submit your answer.',
          );

          this.submitted.set(false);
        },
      });
  }


  nextQuestion(): void {
    if (!this.submitted()) {
      return;
    }

    this.selectedAnswer.set(null);
    this.submitted.set(false);

    this.currentQuestionIndex.update(
      index => index + 1,
    );
  }


  tryAgain(): void {
    this.loadQuiz();
  }


  generateMoreQuestions(): void {
    this.loadQuiz();
  }


  backToHsk(): void {
    const level = this.hskLevel();

    if (level === null) {
      this.router.navigate([
        '/learning',
      ]);

      return;
    }

    this.router.navigate([
      '/learning/hsk',
      level,
    ]);
  }


  getQuizTypeTitle(): string {
    switch (this.quizType()) {
      case 'hanzi_to_meaning':
        return 'Hanzi → Meaning';

      case 'meaning_to_hanzi':
        return 'Meaning → Hanzi';

      case 'hanzi_to_pinyin':
        return 'Hanzi → Pinyin';

      case 'pinyin_to_hanzi':
        return 'Pinyin → Hanzi';

      default:
        return 'Quiz';
    }
  }
}