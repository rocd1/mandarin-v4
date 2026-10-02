from enum import StrEnum


class QuizType(StrEnum):
    HANZI_TO_MEANING = "hanzi_to_meaning"
    MEANING_TO_HANZI = "meaning_to_hanzi"
    HANZI_TO_PINYIN = "hanzi_to_pinyin"
    PINYIN_TO_HANZI = "pinyin_to_hanzi"