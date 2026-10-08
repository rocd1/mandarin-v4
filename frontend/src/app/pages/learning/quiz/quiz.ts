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
  QuizQuestion,
  QuizAnswerResult,
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
  private readonly learningService =
    inject(LearningService);

  private readonly authStateService =
    inject(AuthStateService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);


  hskLevel = signal<number | null>(null);

  quizType = signal<string>('');


  questions = signal<QuizQuestion[]>([]);

  currentQuestionIndex = signal(0);


  selectedAnswers =
    signal<(string | null)[]>(
      Array(10).fill(null),
    );


  correctCount = signal(0);

  incorrectCount = signal(0);


  results = signal<QuizResult[]>([]);


  loading = signal(false);

  submitting = signal(false);

  error = signal('');


  showResults = signal(false);


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
      void this.router.navigate([
        '/learning',
      ]);

      return;
    }


    if (
      !quizType ||
      !validQuizTypes.includes(quizType)
    ) {
      void this.router.navigate([
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

    this.submitting.set(false);

    this.showResults.set(false);


    this.questions.set([]);

    this.currentQuestionIndex.set(0);

    this.selectedAnswers.set(
      Array(10).fill(null),
    );

    this.correctCount.set(0);

    this.incorrectCount.set(0);

    this.results.set([]);


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


  get selectedAnswer(): string | null {
    return (
      this.selectedAnswers()[
        this.currentQuestionIndex()
      ] ?? null
    );
  }


  get isComplete(): boolean {
    return this.showResults();
  }


  selectAnswer(answer: string): void {
    if (this.submitting()) {
      return;
    }


    const index =
      this.currentQuestionIndex();


    this.selectedAnswers.update(
      answers => {
        const updated = [...answers];

        updated[index] = answer;

        return updated;
      },
    );
  }


  previousQuestion(): void {
    const index =
      this.currentQuestionIndex();


    if (index === 0) {
      return;
    }


    this.currentQuestionIndex.update(
      value => value - 1,
    );
  }


  nextQuestion(): void {
    const index =
      this.currentQuestionIndex();


    if (
      index >= 9 ||
      !this.selectedAnswer
    ) {
      return;
    }


    this.currentQuestionIndex.update(
      value => value + 1,
    );
  }


  finishQuiz(): void {
    if (
      this.submitting() ||
      this.questions().length !== 10
    ) {
      return;
    }


    const answers =
      this.selectedAnswers();


    if (
      answers.some(
        answer => !answer,
      )
    ) {
      this.error.set(
        'Please answer all 10 questions before finishing the quiz.',
      );

      return;
    }


    this.error.set('');

    this.submitting.set(true);


    const questions =
      this.questions();


    const results: QuizResult[] = [];

    let correctCount = 0;

    let incorrectCount = 0;


    const submitQuestion = (
      index: number,
    ): void => {
      if (index >= questions.length) {
        this.correctCount.set(
          correctCount,
        );

        this.incorrectCount.set(
          incorrectCount,
        );

        this.results.set(results);

        this.submitting.set(false);

        this.showResults.set(true);

        return;
      }


      const question =
        questions[index];

      const answer =
        answers[index];


      if (!answer) {
        return;
      }


      this.learningService
        .submitQuizAnswer(
          question.id,
          answer,
        )
        .subscribe({
          next: (result) => {
            if (result.correct) {
              correctCount++;
            } else {
              incorrectCount++;
            }


            results.push({
              question:
                question.prompt,

              yourAnswer:
                answer,

              correctAnswer:
                result.correct_answer,

              correct:
                result.correct,
            });


            submitQuestion(
              index + 1,
            );
          },

          error: (error) => {
            console.error(
              'Quiz answer error:',
              error,
            );

            this.error.set(
              'Failed to submit the quiz answers.',
            );

            this.submitting.set(false);
          },
        });
    };


    submitQuestion(0);
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
      void this.router.navigate([
        '/learning',
      ]);

      return;
    }


    void this.router.navigate([
      '/learning/hsk',
      level,
    ]);
  }


  goToRegister(): void {
    void this.router.navigate([
      '/register',
    ]);
  }


  goToLogin(): void {
    void this.router.navigate([
      '/login',
    ]);
  }


  isAuthenticated(): boolean {
    return this.authStateService.isAuthenticated;
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