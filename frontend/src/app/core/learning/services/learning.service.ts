import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../../config/api.config';

import {
  HSKLevel,
  PaginatedStudyWords,
  QuizQuestion,
  QuizAnswerResult,
  UserProgress,
} from '../models/learning.models';


@Injectable({
  providedIn: 'root',
})
export class LearningService {
  private http = inject(HttpClient);

  private readonly baseUrl =
    `${API_CONFIG.baseUrl}/api/learning`;

  
  getHskLevels(): Observable<HSKLevel[]> {
    return this.http.get<HSKLevel[]>(
      `${this.baseUrl}/levels/`,
    );
  }

  getStudyWords(
    hskLevel: number,
    page: number = 1,
    pageSize: number = 50,
  ): Observable<PaginatedStudyWords> {
    return this.http.get<PaginatedStudyWords>(
      `${this.baseUrl}/study/`,
      {
        params: {
          hsk_level: hskLevel,
          page,
          page_size: pageSize,
        },
      },
    );
  }

  getQuizQuestion(
    quizType: string = 'hanzi_to_meaning',
  ): Observable<QuizQuestion> {
    return this.http.get<QuizQuestion>(
      `${this.baseUrl}/quiz/question/`,
      {
        params: {
          quiz_type: quizType,
        },
      },
    );
  }

  submitQuizAnswer(
    questionId: string,
    answer: string,
  ): Observable<QuizAnswerResult> {
    return this.http.post<QuizAnswerResult>(
      `${this.baseUrl}/quiz/answer/`,
      {
        question_id: questionId,
        answer,
      },
    );
  }

  getUserProgress(): Observable<UserProgress[]> {
    return this.http.get<UserProgress[]>(
      `${this.baseUrl}/progress/`,
    );
  }
}