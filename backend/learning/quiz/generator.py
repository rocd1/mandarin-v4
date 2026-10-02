import random
from dataclasses import dataclass

from learning.models import Vocabulary

from .distractors import get_distractors
from .types import QuizType


@dataclass
class QuizQuestion:
    id: str
    quiz_type: QuizType
    vocabulary_id: int
    prompt: str
    options: list[str]
    correct_answer: str


def generate_question(
    vocabulary: Vocabulary,
    quiz_type: QuizType,
) -> QuizQuestion:
    """
    Generate one multiple-choice question for a vocabulary item.
    """

    if quiz_type == QuizType.HANZI_TO_MEANING:
        return _generate_hanzi_to_meaning(vocabulary)

    if quiz_type == QuizType.MEANING_TO_HANZI:
        return _generate_meaning_to_hanzi(vocabulary)

    if quiz_type == QuizType.HANZI_TO_PINYIN:
        return _generate_hanzi_to_pinyin(vocabulary)

    if quiz_type == QuizType.PINYIN_TO_HANZI:
        return _generate_pinyin_to_hanzi(vocabulary)

    raise ValueError(f"Unsupported quiz type: {quiz_type}")


def _generate_hanzi_to_meaning(
    vocabulary: Vocabulary,
) -> QuizQuestion:
    correct_answer = vocabulary.meanings[0]

    distractors = get_distractors(
        vocabulary,
        field="meanings",
        count=3,
    )

    return _build_question(
        vocabulary=vocabulary,
        quiz_type=QuizType.HANZI_TO_MEANING,
        prompt=vocabulary.simplified,
        correct_answer=correct_answer,
        distractors=distractors,
    )


def _generate_meaning_to_hanzi(
    vocabulary: Vocabulary,
) -> QuizQuestion:
    correct_answer = vocabulary.simplified

    distractors = get_distractors(
        vocabulary,
        field="simplified",
        count=3,
    )

    return _build_question(
        vocabulary=vocabulary,
        quiz_type=QuizType.MEANING_TO_HANZI,
        prompt=vocabulary.meanings[0],
        correct_answer=correct_answer,
        distractors=distractors,
    )


def _generate_hanzi_to_pinyin(
    vocabulary: Vocabulary,
) -> QuizQuestion:
    correct_answer = vocabulary.pinyin

    distractors = get_distractors(
        vocabulary,
        field="pinyin",
        count=3,
    )

    return _build_question(
        vocabulary=vocabulary,
        quiz_type=QuizType.HANZI_TO_PINYIN,
        prompt=vocabulary.simplified,
        correct_answer=correct_answer,
        distractors=distractors,
    )


def _generate_pinyin_to_hanzi(
    vocabulary: Vocabulary,
) -> QuizQuestion:
    correct_answer = vocabulary.simplified

    distractors = get_distractors(
        vocabulary,
        field="simplified",
        count=3,
    )

    return _build_question(
        vocabulary=vocabulary,
        quiz_type=QuizType.PINYIN_TO_HANZI,
        prompt=vocabulary.pinyin,
        correct_answer=correct_answer,
        distractors=distractors,
    )


def _build_question(
    vocabulary: Vocabulary,
    quiz_type: QuizType,
    prompt: str,
    correct_answer: str,
    distractors: list[str],
) -> QuizQuestion:
    """
    Build and shuffle the four answer choices.
    """

    options = [
        correct_answer,
        *distractors,
    ]

    random.shuffle(options)

    return QuizQuestion(
        id=f"{vocabulary.pk}-{quiz_type.value}",
        quiz_type=quiz_type,
        vocabulary_id=vocabulary.pk,
        prompt=prompt,
        options=options,
        correct_answer=correct_answer,
    )