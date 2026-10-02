# Learning App

The `learning` app contains the core Mandarin vocabulary and quiz functionality for the Mandarin learning application.

The goal of this app is to provide a simple vocabulary practice experience that can later support:

* Vocabulary browsing and learning
* HSK-level progression
* Multiple-choice vocabulary quizzes
* User vocabulary progress
* Daily learning activities

The app is intentionally kept simple for the first version. More advanced features can be added later as the application grows.

---

# Current Structure

```text
learning/
├── data/
│   ├── 1.json
│   ├── 2.json
│   ├── 3.json
│   ├── 4.json
│   ├── 5.json
│   ├── 6.json
│   └── 7.json
│
├── management/
│   └── commands/
│       └── import_vocabulary.py
│
├── models/
│   ├── hsk_level.py
│   ├── user_progress.py
│   └── vocabulary.py
│
└── quiz/
    ├── distractors.py
    ├── generator.py
    ├── types.py
    └── validators.py
```

The DRF API layer will be added next.

---

# Learning App Concept

The application is designed around a simple daily Mandarin practice routine:

1. **Review** — practice previously learned vocabulary.
2. **Learn** — learn a small number of new words.
3. **Read** — read a short Mandarin passage.
4. **Practice** — use new vocabulary in speaking or writing.

The first version focuses on the vocabulary foundation and quiz system.

HSK levels are used primarily as a way to organize vocabulary and measure progression.

---

# Vocabulary Data

The vocabulary data comes from the `drkameleon/complete-hsk-vocabulary` dataset.

For the current version, the level-specific JSON files are stored locally:

```text
learning/data/
├── 1.json
├── 2.json
├── 3.json
├── 4.json
├── 5.json
├── 6.json
└── 7.json
```

The files represent vocabulary exclusive to each HSK level.

The application maps the final file to:

```text
7.json → HSK 7–9
```

This follows the structure of the source dataset rather than creating separate HSK 7, HSK 8, and HSK 9 assignments.

---

# Vocabulary Import

Vocabulary is imported using the Django management command:

```powershell
python manage.py import_vocabulary
```

The importer:

* Reads all seven JSON files.
* Creates the corresponding HSK levels.
* Imports vocabulary into the `Vocabulary` model.
* Uses the first vocabulary form when an entry contains multiple forms.
* Stores meanings, pinyin, part of speech, radical, and frequency.
* Updates existing vocabulary instead of creating duplicates.
* Skips invalid/incomplete records.

## Import Result

The current dataset successfully imported:

```text
HSK 1      294
HSK 2      197
HSK 3      487
HSK 4      972
HSK 5      1547
HSK 6      1684
HSK 7–9    4876
----------------
Total      10057
```

Verification confirmed:

```text
Vocabulary.objects.count()
→ 10057
```

A duplicate check on the `simplified` field also confirmed that there are currently no duplicate simplified vocabulary entries.

---

# Learning Models

The current learning models are:

## HSKLevel

Represents the user's vocabulary progression levels.

```text
HSK 1
HSK 2
HSK 3
HSK 4
HSK 5
HSK 6
HSK 7–9
```

## Vocabulary

Stores Mandarin vocabulary including:

* Simplified Chinese
* Traditional Chinese
* Pinyin
* Numeric pinyin
* Meanings
* Parts of speech
* Radical
* Frequency
* HSK level

## UserProgress

Stores a user's progress for an individual vocabulary word.

It currently tracks:

* Correct answers
* Incorrect answers
* Last reviewed time
* Next review time
* Creation/update timestamps

A user can have only one `UserProgress` record for each vocabulary word.

---

# Quiz System

The quiz system is located in:

```text
learning/quiz/
```

Four quiz types are currently supported:

```text
HANZI_TO_MEANING
MEANING_TO_HANZI
HANZI_TO_PINYIN
PINYIN_TO_HANZI
```

The quiz generator creates a `QuizQuestion` containing:

* Question ID
* Quiz type
* Vocabulary ID
* Prompt
* Four answer options
* Correct answer

The correct answer is currently used internally by the quiz engine.

It should **not** be exposed to the Angular frontend through the API.

---

# Quiz Question Generation

Questions are generated from real `Vocabulary` records.

For example, the vocabulary word:

```text
爱
ài
```

can generate:

```text
Hanzi → Meaning
Meaning → Hanzi
Hanzi → Pinyin
Pinyin → Hanzi
```

Each question contains four choices:

```text
1 correct answer
3 distractors
```

Distractors are selected primarily from:

1. The same HSK level
2. Vocabulary with overlapping parts of speech
3. A broader vocabulary fallback when necessary

The current distractor system is intentionally simple and will be improved only if real usage shows that better distractors are needed.

---

# Testing in the Django Shell

The Django shell is one of the easiest ways to test Django models and Python code before building the API.

It lets us interact directly with the application's models and quiz engine.

## 1. Start the Django shell

From the backend directory:

```powershell
cd E:\django-projects\mandarin-v4\backend
```

Make sure the virtual environment is active, then run:

```powershell
python manage.py shell
```

You should see something similar to:

```text
Python 3.14.0 ...
(InteractiveConsole)
>>>
```

The `>>>` means Python is ready for a command.

---

## 2. Import a Django model

To work with vocabulary:

```python
from learning.models import Vocabulary
```

Now Python knows about the `Vocabulary` model.

---

## 3. Check how many vocabulary records exist

```python
Vocabulary.objects.count()
```

Expected result:

```text
10057
```

This is useful for quickly confirming that the vocabulary importer worked.

---

## 4. Get a specific vocabulary word

For example:

```python
word = Vocabulary.objects.get(simplified="爱")
```

Now `word` contains the database record for `爱`.

You can inspect individual fields:

```python
word.simplified
```

```text
'爱'
```

```python
word.traditional
```

```text
'愛'
```

```python
word.pinyin
```

```text
'ài'
```

```python
word.pinyin_numeric
```

```text
'ai4'
```

```python
word.meanings
```

```text
['to love; to be fond of; to like',
 'affection',
 'to be inclined (to do sth); to tend to (happen)']
```

```python
word.part_of_speech
```

```text
['v', 'vn', 'b']
```

```python
word.hsk_level
```

```text
<HSKLevel: HSK 1>
```

---

## 5. Test the distractor generator

Import the function:

```python
from learning.quiz.distractors import get_distractors
```

Test meaning distractors:

```python
get_distractors(word, "meanings")
```

Example result:

```text
['to learn', 'to shout', 'comma']
```

Test Hanzi distractors:

```python
get_distractors(word, "simplified")
```

Example result:

```text
['太', '给', '休息']
```

The exact distractors will change because the generator uses random database ordering.

---

## 6. Test the quiz generator

Import the quiz types and generator:

```python
from learning.quiz import QuizType, generate_question
```

Generate a Hanzi → Meaning question:

```python
question = generate_question(
    word,
    QuizType.HANZI_TO_MEANING,
)
```

Inspect the question:

```python
question.prompt
```

```text
'爱'
```

```python
question.options
```

Example:

```text
[
    'to fall ill',
    'to make a telephone call',
    'Excuse me, may I ask...?',
    'to love; to be fond of; to like'
]
```

```python
question.correct_answer
```

```text
'to love; to be fond of; to like'
```

---

## 7. Test all four quiz types

This is a useful basic test:

```python
for quiz_type in QuizType:
    question = generate_question(word, quiz_type)
    print(quiz_type, len(question.options), question.options.count(question.correct_answer) == 1)
```

Expected pattern:

```text
hanzi_to_meaning 4 True
meaning_to_hanzi 4 True
hanzi_to_pinyin 4 True
pinyin_to_hanzi 4 True
```

The three values mean:

```text
quiz type
    ↓
4 = four answer options
    ↓
True = correct answer appears exactly once
```

---

## 8. Test several random vocabulary words

First select five random words:

```python
words = list(Vocabulary.objects.order_by("?")[:5])
```

You can see which words were selected:

```python
[(word.simplified, word.pinyin) for word in words]
```

Test the first word:

```python
word = words[0]
```

Then:

```python
for quiz_type in QuizType:
    question = generate_question(word, quiz_type)
    print(
        quiz_type,
        len(question.options),
        question.options.count(question.correct_answer) == 1,
    )
```

Repeat with:

```python
word = words[1]
```

```python
word = words[2]
```

```python
word = words[3]
```

```python
word = words[4]
```

Each word should produce:

```text
4 True
4 True
4 True
4 True
```

This confirms that each quiz type produces four options and that the correct answer occurs exactly once.

---

## 9. Exit the Django shell

When finished:

```python
exit()
```

You should return to PowerShell:

```text
(venv) PS E:\django-projects\mandarin-v4\backend>
```

---

# Important Django Shell Tip

The interactive Python shell is sensitive to indentation.

For example, this is a complete loop:

```python
for quiz_type in QuizType:
    question = generate_question(word, quiz_type)
    print(quiz_type)
```

After entering the indented lines, press **Enter on an empty line** to tell Python that the block is finished.

The prompt changes from:

```text
>>>
```

to:

```text
...
```

while Python is waiting for the rest of an indented block.

For beginner-friendly testing, it is often easier to test one small block at a time rather than creating deeply nested loops.

---

# Quiz Testing Results

The quiz generator has been tested using real imported vocabulary.

## Test 1 — Real Word

The word:

```text
爱
```

was tested against all four quiz types.

All four tests produced:

```text
4 options
Correct answer appears exactly once
```

## Test 2 — Random Vocabulary

Five randomly selected vocabulary records were tested.

Each word was tested against all four quiz types.

Result:

```text
5 words
×
4 quiz types
=
20 generated questions
```

All generated questions returned:

```text
4 options
Correct answer appears exactly once
```

Therefore, the current V1 quiz generator has passed its initial real-data validation.

---

# Current Status

```text
✅ HSK levels
✅ Vocabulary model
✅ User progress model
✅ Vocabulary dataset
✅ Vocabulary importer
✅ 10,057 vocabulary records
✅ Quiz types
✅ Distractor generation
✅ Quiz question generator
✅ Real-data quiz testing
```

Next:

```text
⬜ DRF serializers
⬜ DRF quiz API
⬜ DRF vocabulary API
⬜ Quiz answer endpoint
⬜ User progress updates
⬜ Angular learning interface
```

---

# V1 Architecture

The intended flow is:

```text
                    ┌──────────────┐
                    │   Angular    │
                    │   Frontend   │
                    └──────┬───────┘
                           │
                           │ HTTP
                           ▼
                    ┌──────────────┐
                    │     DRF      │
                    │     API      │
                    └──────┬───────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      ┌──────────────┐           ┌──────────────┐
      │  Vocabulary  │           │ Quiz Engine  │
      │    Models    │           │    /quiz     │
      └──────────────┘           └──────────────┘
             │                           │
             └─────────────┬─────────────┘
                           ▼
                    ┌──────────────┐
                    │ UserProgress │
                    └──────────────┘
```

The API layer will sit between Angular and the existing learning/quiz logic.

The goal is to keep the existing quiz engine independent from HTTP and Django REST Framework so it can be tested separately and reused by different API endpoints.
