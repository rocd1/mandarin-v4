from learning.models import Vocabulary


def get_distractors(
    vocabulary: Vocabulary,
    field: str,
    count: int = 3,
) -> list[str]:
    """
    Return distinct incorrect answers for a vocabulary word.

    Candidates are selected using:
    1. Same HSK level
    2. Same part of speech
    3. Random vocabulary fallback
    """

    candidates: list[Vocabulary] = []

    # --------------------------------------------------------
    # 1. Prefer vocabulary from the same HSK level
    # --------------------------------------------------------

    if vocabulary.hsk_level_id:
        candidates = list(
            Vocabulary.objects.filter(
                hsk_level_id=vocabulary.hsk_level_id,
            )
            .exclude(pk=vocabulary.pk)
            .order_by("?")[:20]
        )

    # --------------------------------------------------------
    # 2. Prefer same part of speech if available
    # --------------------------------------------------------

    if vocabulary.part_of_speech:
        same_pos = [
            item
            for item in candidates
            if set(item.part_of_speech).intersection(
                vocabulary.part_of_speech
            )
        ]

        candidates = same_pos

    # --------------------------------------------------------
    # 3. Random fallback
    # --------------------------------------------------------

    if len(candidates) < count:
        fallback = list(
            Vocabulary.objects.exclude(
                pk=vocabulary.pk,
            )
            .order_by("?")[:20]
        )

        existing_ids = {item.pk for item in candidates}

        for item in fallback:
            if item.pk not in existing_ids:
                candidates.append(item)
                existing_ids.add(item.pk)

            if len(candidates) >= count:
                break

    # --------------------------------------------------------
    # Extract the requested answer field
    # --------------------------------------------------------

    answers: list[str] = []

    for item in candidates:
        value = getattr(item, field, None)

        if isinstance(value, str):
            value = value.strip()

            if value and value not in answers:
                answers.append(value)

        elif field == "meanings" and item.meanings:
            value = item.meanings[0].strip()

            if value and value not in answers:
                answers.append(value)

        if len(answers) >= count:
            break

    return answers[:count]