export interface QuizQuestion {
  id: string;
  quiz_type: string;
  vocabulary_id: number;
  prompt: string;
  options: string[];
}

export interface QuizAnswerResult {
  question_id: string;
  correct: boolean;
  correct_answer: string;
}

export interface UserProgress {
  vocabulary_id: number;
  simplified: string;
  pinyin: string;
  hsk_level: number;
  correct_count: number;
  incorrect_count: number;
  last_reviewed_at: string | null;
}


export interface HSKLevel {
  id: number;
  name: string;
  order: number;
  description: string;
}


export interface StudyWord {
  id: number;
  simplified: string;
  pinyin: string;
  meaning: string;
}


export interface PaginatedStudyWords {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page: number | null;
  previous_page: number | null;
  results: StudyWord[];
}

export interface QuizQuestionsResponse {
  questions: QuizQuestion[];
}