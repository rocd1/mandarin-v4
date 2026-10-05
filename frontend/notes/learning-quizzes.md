# Mandarin V4 — Learning V1 Checkpoint

This README records the latest stable working state before the study-page flashcard UI change.

## Project

Mandarin vocabulary learning app built with:

- Django 6.0.7
- Django REST Framework
- Angular
- SQLite during development
- Reusable project starter architecture

Backend:

```text
E:\django-projects\mandarin-v4\backend
```

Frontend:

```text
E:\django-projects\mandarin-v4\frontend
```

## Current V1 Learning Flow

```text
Choose HSK
    ↓
Study vocabulary
    ↓
Choose quiz type
    ↓
10-question quiz
    ↓
Quiz result + answer review
    ↓
Try Again / Generate More Questions / Back to HSK
```

Learning pages are available to both guests and authenticated users.

Persistent `UserProgress` is available only to authenticated users.

## HSK Levels

The imported dataset currently provides these seven progression levels:

1. HSK 1
2. HSK 2
3. HSK 3
4. HSK 4
5. HSK 5
6. HSK 6
7. HSK 7–9

HSK 7–9 remains one grouped level because that is how the selected source dataset is organized.

## Vocabulary Dataset

Source:

`drkameleon/complete-hsk-vocabulary`

Imported files:

```text
backend/
└── learning/
    └── data/
        ├── 1.json
        ├── 2.json
        ├── 3.json
        ├── 4.json
        ├── 5.json
        ├── 6.json
        └── 7.json
```

Imported vocabulary:

| Level | Words |
|---|---:|
| HSK 1 | 294 |
| HSK 2 | 197 |
| HSK 3 | 487 |
| HSK 4 | 972 |
| HSK 5 | 1,547 |
| HSK 6 | 1,684 |
| HSK 7–9 | 4,876 |
| **Total** | **10,057** |

No duplicate simplified vocabulary words were found in the imported dataset.

## Learning Models

The current learning models are:

```text
learning/models/
├── hsk_level.py
├── vocabulary.py
├── user_progress.py
└── __init__.py
```

### HSKLevel

Stores the seven HSK progression levels.

### Vocabulary

Stores imported vocabulary information such as:

- simplified
- traditional
- pinyin
- numeric pinyin
- meanings
- part of speech
- radical
- frequency
- HSK level

### UserProgress

Stores persistent progress per:

```text
user + vocabulary
```

The record tracks:

- `correct_count`
- `incorrect_count`
- `last_reviewed_at`
- `next_review_at`
- timestamps

There is a unique constraint preventing duplicate progress rows for the same user and vocabulary word.

## Study Page

Route:

```text
/learning
```

HSK selection:

```text
/learning/hsk/:level
```

The study page currently:

- loads vocabulary for the selected HSK level
- displays 50 words per page
- supports next/previous pagination
- continues until all vocabulary in the HSK level has been browsed
- provides a button to start the quiz
- provides a way back to HSK selection

### Current Study UI

At this checkpoint, the vocabulary is still displayed in the existing plain word box.

The next planned UI change is only a visual/interaction improvement:

- front: Hanzi + pinyin
- back: meaning
- click to flip
- pagination remains unchanged

No backend/API/model changes are required for that flashcard UI change.

## Quiz Types

The app supports four quiz types:

1. Hanzi → Meaning
2. Meaning → Hanzi
3. Hanzi → Pinyin
4. Pinyin → Hanzi

Internal values:

```text
hanzi_to_meaning
meaning_to_hanzi
hanzi_to_pinyin
pinyin_to_hanzi
```

## Quiz Generation

Quiz generation is implemented in:

```text
learning/quiz/
├── __init__.py
├── types.py
├── generator.py
├── distractors.py
└── validators.py
```

Each question contains:

- question ID
- quiz type
- vocabulary ID
- prompt
- four options
- correct answer internally

Three distractors are generated for each question.

The question ID is deterministic:

```text
<vocabulary_id>-<quiz_type>
```

The distractor options are randomized.

The answer endpoint therefore validates the submitted answer against the vocabulary and quiz type rather than depending on regenerated randomized options.

## Bulk Quiz Generation

The quiz originally loaded questions with multiple HTTP requests.

That caused unnecessary requests and eventually triggered the API rate limiter.

The architecture has now been changed to generate the complete 10-question quiz in one request.

Current endpoint:

```text
GET /api/learning/quiz/questions/?hsk_level=2&quiz_type=hanzi_to_meaning
```

The backend:

1. finds vocabulary for the requested HSK level
2. selects 10 vocabulary entries
3. generates one question for each
4. returns all 10 questions

The current V1 intentionally allows repeated vocabulary in a generated 10-question set.

## Quiz Answer Submission

Endpoint:

```text
POST /api/learning/quiz/answer/
```

The frontend submits:

```json
{
  "question_id": "123-hanzi_to_meaning",
  "answer": "..."
}
```

The backend returns:

```json
{
  "question_id": "123-hanzi_to_meaning",
  "correct": true,
  "correct_answer": "..."
}
```

For authenticated users, the answer also updates `UserProgress`.

Correct answer:

```text
correct_count += 1
```

Incorrect answer:

```text
incorrect_count += 1
```

Every submitted answer updates:

```text
last_reviewed_at
```

Guest answers are evaluated but do not create persistent user progress.

## Quiz Result

After 10 questions, the frontend displays:

```text
Quiz Complete

8 / 10

Correct: 8
Incorrect: 2
```

It also displays an answer review containing:

- question
- user's answer
- correct answer
- correct/incorrect status

Available actions:

- Try Again
- Generate More Questions
- Back to HSK

Both Try Again and Generate More Questions currently generate another 10-question set.

V1 does not require quiz history or quiz attempt database models.

## Current API Structure

```text
/api/learning/
├── levels/
├── study/
├── quiz/
│   ├── question/       # legacy single-question endpoint
│   ├── questions/      # current 10-question endpoint
│   └── answer/
└── progress/
```

### Important Cleanup Note

The old single-question endpoint is no longer used by the production Angular quiz flow.

It is intentionally being left in place temporarily so it can be cleaned up separately.

Before deleting it, search for references to:

```text
getQuizQuestion
/quiz/question/
QuizQuestionView
```

After confirming there are no remaining references, the old service method, view, and URL can be removed.

This cleanup does not need to happen before the next UI change.

## Angular Learning Structure

```text
frontend/src/app/
├── core/
│   └── learning/
│       ├── models/
│       └── services/
└── pages/
    └── learning/
        ├── hsk-selection/
        ├── study/
        ├── quiz-selection/
        └── quiz/
```

Current learning routes:

```text
/learning
/learning/hsk/:level
/learning/hsk/:level/quiz
/learning/hsk/:level/quiz/:quizType
```

Learning routes are intentionally outside the authentication guard because guest users can study and take quizzes.

The protected application area remains under:

```text
/app
```

## Tests Completed

The following functionality has been tested successfully:

- HSK level API
- HSK vocabulary pagination
- HSK 1 pagination:
  - page 1 → 50
  - page 2 → 50
  - page 3 → 50
  - page 4 → 50
  - page 5 → 50
  - page 6 → 44
  - page 7 → 404 as expected
- bulk 10-question quiz generation
- all four quiz types
- quiz answer submission
- guest quiz flow
- authenticated progress updates
- quiz result and answer review
- Try Again
- Generate More Questions
- Back to HSK
- replacement of 10 parallel quiz-question requests with one bulk request

The bulk quiz change resolved the previous rate-limit problem caused by multiple simultaneous question requests.

## Current Stable Checkpoint

Before making the next UI change, the project should be considered a working checkpoint:

```text
HSK selection
    ↓
Study with 50-word pagination
    ↓
Quiz type selection
    ↓
10-question bulk quiz
    ↓
Answer submission
    ↓
Result + review
    ↓
Retry / more questions / back
```

The next planned change is the study-page flip-card UI only.

## Suggested Commit

Before changing the study card UI, create a Git commit so the current working version is easy to return to.

Example:

```powershell
cd E:\django-projects\mandarin-v4

git status

git add .

git commit -m "Checkpoint working learning flow before flashcards"
```

After the commit, verify:

```powershell
git status
```

A clean working tree is a good checkpoint before starting the flashcard UI change.

## Development Principle

Keep V1 simple:

- no unnecessary history models
- no unnecessary quiz session models
- no token storage in browser storage
- guest quiz remains available
- persistent progress is authenticated-user only
- one bulk request for a 10-question quiz
- make UI changes independently from backend changes when possible
- validate each step before moving to the next feature
