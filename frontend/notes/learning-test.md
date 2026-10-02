# Learning Test — Angular Quiz, UserProgress, and Signals

## Purpose

This page is a developer test page for the Mandarin learning feature.

It lets us visually test the complete flow:

1. Angular requests a quiz question.
2. Django returns a question.
3. Angular displays the question.
4. The user selects an answer.
5. Angular sends the answer to Django.
6. Django checks whether the answer is correct.
7. Django updates `UserProgress` for logged-in users.
8. Angular requests the updated progress.
9. Angular displays the updated progress.

This page is temporary developer/test UI. It is not the final Mandarin learning interface.

---

# 1. The Learning Architecture

The current learning feature has these main layers:

```text
Angular Page
    │
    ▼
LearningService
    │
    ▼
Django REST API
    │
    ├── Quiz Generator
    │
    ├── Vocabulary
    │
    └── UserProgress
```

More specifically:

```text
LearningTest
    │
    │ getQuizQuestion()
    ▼
LearningService
    │
    │ GET /api/learning/quiz/question/
    ▼
Django QuizQuestionView
    │
    ▼
Vocabulary
    │
    ▼
generate_question()
    │
    ▼
JSON response
    │
    ▼
LearningTest
```

When the user answers:

```text
LearningTest
    │
    │ submitQuizAnswer()
    ▼
LearningService
    │
    │ POST /api/learning/quiz/answer/
    ▼
Django QuizAnswerView
    │
    ├── Check answer
    │
    └── Update UserProgress
    │
    ▼
JSON response
    │
    ▼
LearningTest
```

---

# 2. Vocabulary

Our vocabulary database contains the imported Mandarin vocabulary.

For example:

```text
右边
yòu bian
right side
```

and:

```text
接纳
jiē nà
to admit (to membership)
```

Each vocabulary record belongs to an HSK level.

The current dataset contains:

```text
10,057 vocabulary records
```

The `Vocabulary` model contains information such as:

```text
simplified
traditional
pinyin
pinyin_numeric
meanings
part_of_speech
radical
frequency
hsk_level
```

---

# 3. Quiz Generation

The quiz system currently supports four quiz types:

```text
hanzi_to_meaning
meaning_to_hanzi
hanzi_to_pinyin
pinyin_to_hanzi
```

For example:

```text
Quiz type: hanzi_to_meaning

Prompt:

右边

Options:

right side
chart
to run this way and that (idiom); to rush about busily
side; adjacent place
```

The correct answer is stored internally by the server.

The API deliberately does **not** send `correct_answer` when the question is first requested.

That prevents the frontend from already knowing the answer.

---

# 4. Answer Submission

When the user selects:

```text
right side
```

Angular sends:

```json
{
  "question_id": "....",
  "answer": "right side"
}
```

to:

```text
POST /api/learning/quiz/answer/
```

Django then determines whether the answer is correct.

The response contains:

```json
{
  "question_id": "...",
  "correct": true,
  "correct_answer": "right side"
}
```

The frontend can therefore display:

```text
Correct!

Correct answer: right side
```

---

# 5. UserProgress

`UserProgress` stores the user's learning results for each vocabulary word.

The important fields are:

```text
correct_count
incorrect_count
last_reviewed_at
next_review_at
```

There is also a database constraint:

```text
unique(user, vocabulary)
```

This means one user has only one progress record for a particular vocabulary word.

For example:

```text
User
  │
  ├── 右边
  │     correct: 1
  │     incorrect: 0
  │
  └── 接纳
        correct: 0
        incorrect: 1
```

---

# 6. What We Have Successfully Tested

## Correct answer

We answered:

```text
右边 → right side
```

The database/UI showed:

```text
右边 — yòu bian

Correct: 1
Incorrect: 0
```

This verified that:

```text
correct_count += 1
```

works.

---

## Incorrect answer

We answered:

```text
接纳
```

incorrectly.

The database/UI showed:

```text
接纳 — jiē nà

Correct: 0
Incorrect: 1
```

This verified that:

```text
incorrect_count += 1
```

works.

---

# 7. The Angular Service

The Angular page does not communicate directly with Django.

Instead, it uses:

```text
LearningService
```

located at:

```text
src/app/core/learning/services/learning.service.ts
```

For example:

```typescript
getQuizQuestion(): Observable<QuizQuestion> {
  return this.http.get<QuizQuestion>(...);
}
```

The page calls:

```typescript
this.learningService.getQuizQuestion(...)
```

The service calls Django.

This separation is useful because:

```text
Component
    ↓
Service
    ↓
API
```

keeps HTTP/API logic out of the UI component.

---

# 8. The Interesting Problem We Found

Initially, Django was clearly returning the correct data.

The browser's Network tab showed:

```text
GET /api/learning/progress/     200
GET /api/learning/quiz/question/ 200
```

Django also logged:

```text
GET /api/learning/progress/ HTTP/1.1 200
GET /api/learning/quiz/question/ HTTP/1.1 200
```

So the backend was working.

However, the Angular page remained stuck on:

```text
Loading question...
```

and:

```text
Loading progress...
```

This was important because it showed that the problem was **not the Django API**.

The HTTP request succeeded.

The problem was the Angular view not updating after the asynchronous response.

---

# 9. The Temporary Fix: ChangeDetectorRef

We temporarily added:

```typescript
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
```

and:

```typescript
private changeDetectorRef = inject(ChangeDetectorRef);
```

Then after receiving the HTTP response:

```typescript
next: (question) => {
  this.question = question;
  this.questionLoading = false;

  this.changeDetectorRef.detectChanges();
}
```

This forced Angular to check the component and update the template.

After doing this, the page immediately started displaying the question and progress.

Therefore:

```text
HTTP request
    ↓
Response received
    ↓
Component properties changed
    ↓
detectChanges()
    ↓
Template updated
```

This proved that the problem was related to Angular change detection.

---

# 10. Why We Don't Want `detectChanges()` Everywhere

Although this worked, we don't want our application to become full of code like:

```typescript
this.changeDetectorRef.detectChanges();
```

after every HTTP response.

That would mean we are manually telling Angular:

> "I changed something. Please check the screen."

Angular provides more reactive ways to represent state.

One of those mechanisms is:

```text
Signals
```

Signals allow Angular to know when state used by the template changes.

---

# 11. Signals — Beginner Explanation

A normal property looks like this:

```typescript
question: QuizQuestion | null = null;
```

We change it with:

```typescript
this.question = question;
```

A signal looks like this:

```typescript
question = signal<QuizQuestion | null>(null);
```

We change it with:

```typescript
this.question.set(question);
```

And we read it with:

```typescript
this.question()
```

The important difference is that a signal is **reactive state**.

Angular can track that the template is using the signal.

For example:

```typescript
question = signal<QuizQuestion | null>(null);
```

Template:

```html
@if (question()) {
  <h3>{{ question()!.prompt }}</h3>
}
```

When we do:

```typescript
this.question.set(question);
```

Angular knows that the signal changed and can update the part of the UI that depends on it.

---

# 12. Normal Property vs Signal

## Normal property

```typescript
question: QuizQuestion | null = null;

this.question = question;
```

Template:

```html
@if (question) {
  <h3>{{ question.prompt }}</h3>
}
```

---

## Signal

```typescript
question = signal<QuizQuestion | null>(null);

this.question.set(question);
```

Template:

```html
@if (question()) {
  <h3>{{ question()!.prompt }}</h3>
}
```

The signal version explicitly represents:

```text
question = reactive state
```

---

# 13. The State in LearningTest

Our test page currently has several pieces of state:

```text
question
answerResult
progress

questionLoading
answerLoading
progressLoading

questionError
progressError
```

These are all things that affect what the user sees.

That makes them good candidates for signals.

For example:

```typescript
question = signal<QuizQuestion | null>(null);
```

and:

```typescript
questionLoading = signal(false);
```

Then:

```typescript
this.question.set(question);
this.questionLoading.set(false);
```

---

# 14. What We Are Going to Change

We will change only:

```text
LearningTest
```

We will **not** change:

```text
Django models
Django API
Quiz generator
LearningService
app.config.ts
Authentication
UserProgress
```

The goal is to isolate the Angular UI change.

Current architecture:

```text
HTTP response
    ↓
ordinary component property
    ↓
ChangeDetectorRef.detectChanges()
    ↓
template
```

Target architecture:

```text
HTTP response
    ↓
signal.set(...)
    ↓
Angular tracks reactive state
    ↓
template updates
```

---

# 15. Important: We Are Not Changing `app.config.ts`

Our current `app.config.ts` contains:

```typescript
provideRouter(routes),

provideHttpClient(
  withInterceptors([
    authInterceptor,
  ]),
),

provideAppInitializer(initializeApp),
```

There is no explicit:

```typescript
provideZonelessChangeDetection()
```

in the file.

We are therefore not going to modify the application-wide configuration just to solve this test page.

Instead, we are going to make the component's state properly reactive.

This keeps the change small and easier to understand.

---

# 16. Testing the New Signal Version

After converting `LearningTest` to signals, we should test the same flow again.

## Test 1 — Page loads

Open:

```text
http://localhost:4200/learning-test
```

Expected:

```text
Quiz
Quiz type: hanzi_to_meaning

[Chinese word]

[options]
```

We should no longer need:

```typescript
detectChanges()
```

---

## Test 2 — Correct answer

Choose the correct answer.

Expected:

```text
Correct!

Correct answer: ...
```

Then UserProgress should show something like:

```text
Correct: 1
Incorrect: 0
```

---

## Test 3 — Incorrect answer

Click:

```text
Next Question
```

Then intentionally choose a wrong answer.

Expected:

```text
Incorrect.

Correct answer: ...
```

Progress should show:

```text
Correct: 0
Incorrect: 1
```

for a newly encountered vocabulary word.

---

## Test 4 — Same word again

If the same vocabulary word is answered correctly again:

```text
Correct: 2
Incorrect: 1
```

should become possible.

It should **not** create another `UserProgress` record.

This verifies:

```text
unique(user, vocabulary)
```

is still working.

---

# 17. How to Debug This Flow

When something doesn't appear on the page, check the layers in order.

## Step 1 — Browser Network tab

Look for:

```text
GET /api/learning/quiz/question/
GET /api/learning/progress/
POST /api/learning/quiz/answer/
```

Check the HTTP status.

```text
200 = successful
400 = bad request
401 = authentication required
404 = not found
405 = wrong HTTP method
500 = Django/server error
```

---

## Step 2 — Django terminal

Check the Django development server output.

For example:

```text
GET /api/learning/quiz/question/ 200
POST /api/learning/quiz/answer/ 200
GET /api/learning/progress/ 200
```

If Django shows `200`, the request reached the backend successfully.

---

## Step 3 — API response

Look at the response itself.

Question:

```json
{
  "id": "...",
  "quiz_type": "hanzi_to_meaning",
  "vocabulary_id": 123,
  "prompt": "右边",
  "options": [
    "right side",
    "..."
  ]
}
```

Answer:

```json
{
  "question_id": "...",
  "correct": true,
  "correct_answer": "right side"
}
```

Progress:

```json
[
  {
    "vocabulary_id": 123,
    "simplified": "右边",
    "pinyin": "yòu bian",
    "correct_count": 1,
    "incorrect_count": 0,
    "last_reviewed_at": "..."
  }
]
```

---

## Step 4 — Angular component state

If the API response is correct but the page does not update, investigate Angular state and change detection.

This is exactly the problem we encountered.

---

# 18. What We Learned

This test taught us an important full-stack debugging lesson.

A successful API request does **not** automatically mean the user interface will display the result.

There are multiple stages:

```text
Database
   ↓
Django
   ↓
HTTP response
   ↓
Angular HttpClient
   ↓
Observable
   ↓
Component state
   ↓
Angular change detection
   ↓
Template
   ↓
Browser
```

A bug can happen at any stage.

In our case:

```text
Database       ✓
Django API     ✓
HTTP request   ✓
HTTP response  ✓
Component data ✓
UI update      ✗
```

`ChangeDetectorRef.detectChanges()` helped prove that the problem was at the UI change-detection stage.

Now we are improving the component by using Angular signals.

---

# 19. Current Status

The backend learning system is working.

Verified:

```text
✓ Vocabulary imported
✓ HSK levels available
✓ Quiz generator working
✓ Four quiz types implemented
✓ Distractors generated
✓ Quiz question API working
✓ Quiz answer API working
✓ Correct answers recorded
✓ Incorrect answers recorded
✓ UserProgress created
✓ UserProgress updated
✓ Progress API working
✓ Angular LearningService working
✓ Angular quiz page working
```

The remaining frontend task is:

```text
Convert LearningTest state to Angular signals
Remove ChangeDetectorRef
Retest the complete flow
```

After that, we can use the result as a pattern for the real Mandarin learning pages.
