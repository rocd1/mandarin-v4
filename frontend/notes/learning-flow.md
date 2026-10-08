# Mandarin V4 — Learning V1

This README records the current stable working state of the Mandarin vocabulary learning flow.

## Project

Mandarin vocabulary learning app built with:

* Django 6.0.7
* Django REST Framework
* Angular
* SQLite during development
* Reusable project starter architecture

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
Flashcards
    ↓
Choose quiz type
    ↓
10-question quiz
    ↓
Submit Quiz
    ↓
Quiz result + answer review
    ↓
Try Again / Generate More Questions / Back to HSK
```

Learning pages are available to both guests and authenticated users.

Persistent `UserProgress` is available only to authenticated users.

## Guest and Authenticated User Behavior

### Guest users

Guests can:

* choose an HSK level
* study vocabulary
* use the flashcards
* choose a quiz type
* take a 10-question quiz
* submit quiz answers
* view quiz results
* review their answers
* try the quiz again
* generate more questions
* return to HSK selection

Guests do **not** have persistent learning progress.

The frontend does not call:

```text
GET /api/learning/progress/
```

for guest users.

Guests also do not see the HSK progress bar on the Study page.

### Authenticated users

Authenticated users can do everything guests can, plus:

* have quiz answers saved to `UserProgress`
* see their HSK study progress on the Study page

The Study page loads `/progress/` only when the user is authenticated.

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

| Level     |      Words |
| --------- | ---------: |
| HSK 1     |        294 |
| HSK 2     |        197 |
| HSK 3     |        487 |
| HSK 4     |        972 |
| HSK 5     |      1,547 |
| HSK 6     |      1,684 |
| HSK 7–9   |      4,876 |
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

* simplified
* traditional
* pinyin
* numeric pinyin
* meanings
* part of speech
* radical
* frequency
* HSK level

### UserProgress

Stores persistent progress per:

```text
user + vocabulary
```

The record tracks:

* `correct_count`
* `incorrect_count`
* `last_reviewed_at`
* `next_review_at`
* timestamps

There is a unique constraint preventing duplicate progress rows for the same user and vocabulary word.

There are currently no separate quiz history or quiz attempt models.

## Study Page

Routes:

```text
/learning
/learning/hsk/:level
```

The HSK selection page allows the user to choose a level.

The Study page:

* loads vocabulary for the selected HSK level
* displays 50 words per page
* supports next/previous pagination
* displays vocabulary as flashcards
* supports flipping a card
* provides a button to start the quiz
* provides a way back to HSK selection

### Flashcards

The current flashcard design is:

```text
Front
─────
Hanzi
Pinyin

        ↓ flip

Back
────
Meaning
```

The cards support:

* hover/click interaction on desktop
* tap/click interaction on mobile
* Hanzi + pinyin on the front
* meaning on the back

The flashcard UI is a frontend-only change.

No additional backend model or API is required for the flashcard behavior.

### Study Pagination

Vocabulary is displayed 50 words per page.

The backend returns pagination information including:

* total vocabulary count
* current page
* page size
* total pages
* next page
* previous page
* current page results

The total vocabulary count is used for HSK progress calculations.

## HSK Study Progress

Authenticated users see an HSK progress card on the Study page.

The progress represents vocabulary records that have a `UserProgress` record for the selected HSK.

The calculation is:

```text
words studied / total HSK vocabulary
```

For example:

```text
HSK 1 Progress

████████░░ 80%

235 / 294 words studied
```

The denominator is the **total vocabulary count for the selected HSK level**, not the current 50-word page.

The Study API's pagination count represents the total number of matching vocabulary records.

Guests do not see this progress card.

Guests also do not make a `/progress/` API request.

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

* question ID
* quiz type
* vocabulary ID
* prompt
* four options
* correct answer internally

Three distractors are generated for each question.

The question ID is deterministic:

```text
<vocabulary_id>-<quiz_type>
```

The distractor options are randomized.

The answer endpoint therefore validates the submitted answer against the vocabulary and quiz type rather than depending on regenerated randomized options.

## Bulk Quiz Generation

The quiz uses one backend request to generate the complete 10-question quiz.

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

Using one bulk request avoids the previous problem of making 10 simultaneous question requests and triggering the API rate limiter.

## Quiz Navigation

The quiz contains 10 questions.

The user can:

* select an answer
* move to the next question
* move back to the previous question
* change an answer before submitting

Answers are held temporarily in Angular while the user moves through the quiz.

They are not submitted after every question.

The navigation is:

```text
Questions 1–9
    ↓
Next Question
```

Question 10:

```text
Submit Quiz
```

This keeps the quiz as one complete 10-question activity from the user's perspective.

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

When the user selects **Submit Quiz**, the frontend submits the 10 answers to the backend.

The frontend then builds the final quiz result from the returned answers.

### Authenticated Users

For authenticated users, each submitted answer updates `UserProgress`.

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

### Guest Users

Guest answers are evaluated normally.

They do not create persistent `UserProgress` records.

## Quiz Result

After all 10 answers have been submitted, the frontend displays:

```text
Quiz Complete

8 / 10

Correct: 8
Incorrect: 2
```

The result also includes an answer review containing:

* question
* user's answer
* correct answer
* correct/incorrect status

Available actions:

* Try Again
* Generate More Questions
* Back to HSK

Both **Try Again** and **Generate More Questions** currently generate another 10-question set.

## Save Progress

Guest users can complete the learning and quiz flow without creating an account.

After completing a quiz, guests are shown an option to:

```text
Create an Account
```

or:

```text
Sign In
```

This allows them to continue using the app without requiring authentication while providing a path to persistent learning progress.

## Current API Structure

```text
/api/learning/
├── levels/
├── study/
├── quiz/
│   ├── question/       # legacy single-question endpoint
│   ├── questions/      # current 10-question endpoint
│   └── answer/
└── progress/           # authenticated users only
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

This cleanup is separate from the current V1 learning flow.

## Angular Learning Structure

```text
frontend/src/app/
├── core/
│   ├── auth/
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

## Authentication and Learning State

Authentication state is managed by the Angular `AuthStateService`.

The Study page uses the authentication state to determine whether persistent progress should be loaded.

The important rule is:

```text
Authenticated
    → load UserProgress
    → show HSK progress

Guest
    → do not load UserProgress
    → hide HSK progress
```

This avoids using a failed `/progress/` request as a way to determine whether the user is authenticated.

## Tests Completed

The following functionality has been tested successfully:

* HSK level API
* HSK vocabulary pagination
* HSK 1 pagination:

  * page 1 → 50
  * page 2 → 50
  * page 3 → 50
  * page 4 → 50
  * page 5 → 50
  * page 6 → 44
  * page 7 → 404 as expected
* study page
* vocabulary flashcards
* flashcard flipping
* authenticated study flow
* guest study flow
* authenticated HSK progress
* guest study without `/progress/`
* bulk 10-question quiz generation
* all four quiz types
* quiz answer submission
* guest quiz flow
* authenticated progress updates
* Previous Question navigation
* Next Question navigation
* changing answers before submission
* Submit Quiz
* quiz result and answer review
* Try Again
* Generate More Questions
* Back to HSK
* guest result save-progress options
* replacement of 10 parallel quiz-question requests with one bulk request

The bulk quiz change resolved the previous rate-limit problem caused by multiple simultaneous question requests.

## Current Stable Learning Checkpoint

The current V1 learning flow is:

```text
Landing / Login / Register / Guest
              ↓
        HSK Selection
              ↓
       Study Vocabulary
              ↓
          Flashcards
              ↓
        Choose Quiz Type
              ↓
        10-Question Quiz
              ↓
         Submit Quiz
              ↓
       Quiz Complete
              ↓
        Answer Review
              ↓
   ┌──────────┼─────────────┐
   ↓          ↓             ↓
Try Again  Generate More  Back to HSK
```

For authenticated users:

```text
Quiz answers
     ↓
UserProgress
     ↓
HSK study progress
```

For guests:

```text
Quiz answers
     ↓
No persistent UserProgress
```

The current learning flow is considered a stable V1 checkpoint.

## Suggested Git Checkpoint

After updating this README, commit the documentation separately from the previous working-code checkpoint.

Example:

```powershell
cd E:\django-projects\mandarin-v4

git status

git add README.md

git commit -m "Update README for current learning flow"
```

Then verify:

```powershell
git status
```

Expected result:

```text
nothing to commit, working tree clean
```

## Development Principle

Keep V1 simple:

* no unnecessary history models
* no unnecessary quiz session models
* no token storage in browser storage
* guest learning remains available
* guest quiz remains available
* persistent progress is authenticated-user only
* authenticated users can see HSK study progress
* guests do not call `/progress/`
* one bulk request for a 10-question quiz
* answers are submitted when the quiz is finished
* quiz results are displayed after submission
* make UI changes independently from backend changes when possible
* validate each step before moving to the next feature


```
The important README changes from the previous version are:

Study page

Previously it said the next change was the flip-card UI. That is now completed.

We should document:

Study Page
├── HSK vocabulary
├── 50 words per page
├── Previous / Next pagination
├── Flip cards
├── Hanzi + pinyin on front
├── meaning on back
└── Start Quiz
Authentication and guest behavior

We should now explicitly document:

Guest
├── Can select HSK
├── Can study vocabulary
├── Can use flashcards
├── Can take quizzes
├── Can submit quiz answers
└── Does not have persistent UserProgress

Authenticated user
├── Can do everything guests can
├── Quiz answers update UserProgress
└── Can see HSK study progress
HSK progress

The current progress behavior should be documented as:

HSK Progress

studied vocabulary / total HSK vocabulary

For example:

120 / 294 words studied

The /study/ API already returns paginator.count, which is the total vocabulary count for the selected HSK, while results contains the current page.

Quiz submission

The README should also reflect the new UX:

Question 1–9
    ↓
Next Question
    ↓
Question 10
    ↓
Submit Quiz
    ↓
Quiz Complete
    ↓
Answer Review
```