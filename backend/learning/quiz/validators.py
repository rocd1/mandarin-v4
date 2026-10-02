from learning.models import Vocabulary

from .types import QuizType


def validate_quiz_type(
    quiz_type: str,
) -> QuizType:
    """
    Convert a string into a valid QuizType.

    Raises ValueError when the quiz type is invalid.
    """

    try:
        return QuizType(quiz_type)
    except ValueError:
        raise ValueError(
            f"Invalid quiz type: {quiz_type}"
        )


def validate_vocabulary(
    vocabulary: Vocabulary,
    quiz_type: QuizType,
) -> None:
    """
    Make sure the vocabulary contains the data required
    for the requested quiz type.
    """

    if not vocabulary.simplified:
        raise ValueError(
            "Vocabulary is missing simplified Chinese."
        )

    if quiz_type in {
        QuizType.HANZI_TO_MEANING,
        QuizType.MEANING_TO_HANZI,
    }:
        if not vocabulary.meanings:
            raise ValueError(
                "Vocabulary has no meanings."
            )

    if quiz_type in {
        QuizType.HANZI_TO_PINYIN,
        QuizType.PINYIN_TO_HANZI,
    }:
        if not vocabulary.pinyin:
            raise ValueError(
                "Vocabulary has no pinyin."
            )