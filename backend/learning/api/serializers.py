from rest_framework import serializers

from learning.quiz import QuizQuestion


class QuizQuestionSerializer(serializers.Serializer):
    id = serializers.CharField()
    quiz_type = serializers.CharField()
    vocabulary_id = serializers.IntegerField()
    prompt = serializers.CharField()
    options = serializers.ListField(
        child=serializers.CharField(),
    )

    def to_representation(self, instance: QuizQuestion) -> dict:
        return {
            "id": instance.id,
            "quiz_type": instance.quiz_type.value,
            "vocabulary_id": instance.vocabulary_id,
            "prompt": instance.prompt,
            "options": instance.options,
        }

class QuizQuestionListSerializer(
    serializers.Serializer
):
    questions = QuizQuestionSerializer(
        many=True,
    )


class QuizAnswerSerializer(serializers.Serializer):
    question_id = serializers.CharField()
    answer = serializers.CharField(
        allow_blank=False,
    )

class UserProgressSerializer(serializers.Serializer):
    vocabulary_id = serializers.IntegerField()
    simplified = serializers.CharField()
    pinyin = serializers.CharField()
    hsk_level = serializers.IntegerField()
    correct_count = serializers.IntegerField()
    incorrect_count = serializers.IntegerField()
    last_reviewed_at = serializers.DateTimeField(
        allow_null=True,
    )


class HSKLevelSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    order = serializers.IntegerField()
    description = serializers.CharField()


class StudyWordSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    simplified = serializers.CharField()
    pinyin = serializers.CharField()
    meaning = serializers.CharField()