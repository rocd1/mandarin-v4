import random

from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.utils import timezone

from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from learning.models import HSKLevel, UserProgress, Vocabulary
from learning.quiz import generate_question
from learning.quiz.validators import validate_quiz_type

from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import (
    HSKLevelSerializer,
    QuizAnswerSerializer,
    QuizQuestionSerializer,
    StudyWordSerializer,
    UserProgressSerializer,
)


class HSKLevelListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        levels = HSKLevel.objects.all()

        serializer = HSKLevelSerializer(
            levels,
            many=True,
        )

        return Response(serializer.data)


class StudyWordListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        hsk_level_value = request.query_params.get(
            "hsk_level",
            "1",
        )

        page_value = request.query_params.get(
            "page",
            "1",
        )

        page_size_value = request.query_params.get(
            "page_size",
            "50",
        )

        try:
            hsk_level_order = int(hsk_level_value)
        except ValueError:
            return Response(
                {
                    "detail": "Invalid HSK level.",
                },
                status=400,
            )

        try:
            page_number = int(page_value)
        except ValueError:
            return Response(
                {
                    "detail": "Invalid page number.",
                },
                status=400,
            )

        try:
            page_size = int(page_size_value)
        except ValueError:
            return Response(
                {
                    "detail": "Invalid page size.",
                },
                status=400,
            )

        if hsk_level_order < 1 or hsk_level_order > 7:
            return Response(
                {
                    "detail": "HSK level must be between 1 and 7.",
                },
                status=400,
            )

        if page_number < 1:
            return Response(
                {
                    "detail": "Page number must be at least 1.",
                },
                status=400,
            )

        if page_size < 1 or page_size > 50:
            return Response(
                {
                    "detail": "Page size must be between 1 and 50.",
                },
                status=400,
            )

        try:
            hsk_level = HSKLevel.objects.get(
                order=hsk_level_order,
            )
        except HSKLevel.DoesNotExist:
            return Response(
                {
                    "detail": "HSK level not found.",
                },
                status=404,
            )

        vocabulary = (
            Vocabulary.objects
            .filter(hsk_level=hsk_level)
            .order_by(
                "frequency",
                "simplified",
            )
        )

        paginator = Paginator(
            vocabulary,
            page_size,
        )

        try:
            page = paginator.page(page_number)
        except (PageNotAnInteger, EmptyPage):
            return Response(
                {
                    "detail": "Page not found.",
                },
                status=404,
            )

        words = [
            {
                "id": item.id,
                "simplified": item.simplified,
                "pinyin": item.pinyin,
                "meaning": (
                    item.meanings[0]
                    if item.meanings
                    else ""
                ),
            }
            for item in page.object_list
        ]

        serializer = StudyWordSerializer(
            words,
            many=True,
        )

        return Response(
            {
                "count": paginator.count,
                "page": page.number,
                "page_size": page_size,
                "total_pages": paginator.num_pages,
                "next_page": (
                    page.next_page_number()
                    if page.has_next()
                    else None
                ),
                "previous_page": (
                    page.previous_page_number()
                    if page.has_previous()
                    else None
                ),
                "results": serializer.data,
            }
        )


class QuizQuestionView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        quiz_type_value = request.query_params.get(
            "quiz_type",
            "hanzi_to_meaning",
        )

        try:
            quiz_type = validate_quiz_type(
                quiz_type_value
            )
        except ValueError as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=400,
            )

        vocabulary_ids = list(
            Vocabulary.objects.values_list(
                "id",
                flat=True,
            )
        )

        if not vocabulary_ids:
            return Response(
                {
                    "detail": "No vocabulary is available.",
                },
                status=404,
            )

        vocabulary_id = random.choice(
            vocabulary_ids
        )

        vocabulary = Vocabulary.objects.get(
            pk=vocabulary_id
        )

        question = generate_question(
            vocabulary,
            quiz_type,
        )

        serializer = QuizQuestionSerializer(question)

        return Response(serializer.data)


class QuizAnswerView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = QuizAnswerSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        question_id = serializer.validated_data["question_id"]
        answer = serializer.validated_data["answer"].strip()

        try:
            vocabulary_id, quiz_type_value = (
                question_id.split("-", 1)
            )
        except ValueError:
            return Response(
                {
                    "detail": "Invalid question ID.",
                },
                status=400,
            )

        try:
            vocabulary_id = int(vocabulary_id)
        except ValueError:
            return Response(
                {
                    "detail": "Invalid question ID.",
                },
                status=400,
            )

        try:
            quiz_type = validate_quiz_type(
                quiz_type_value
            )
        except ValueError as exc:
            return Response(
                {
                    "detail": str(exc),
                },
                status=400,
            )

        try:
            vocabulary = Vocabulary.objects.get(
                pk=vocabulary_id
            )
        except Vocabulary.DoesNotExist:
            return Response(
                {
                    "detail": "Question not found.",
                },
                status=404,
            )

        question = generate_question(
            vocabulary,
            quiz_type,
        )

        is_correct = (
            answer == question.correct_answer
        )

        if request.user.is_authenticated:
            progress, _ = (
                UserProgress.objects.get_or_create(
                    user=request.user,
                    vocabulary=vocabulary,
                )
            )

            if is_correct:
                progress.correct_count += 1
            else:
                progress.incorrect_count += 1

            progress.last_reviewed_at = timezone.now()

            progress.save()

        return Response(
            {
                "question_id": question.id,
                "correct": is_correct,
                "correct_answer": question.correct_answer,
            }
        )

class UserProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        progress = (
            UserProgress.objects
            .filter(user=request.user)
            .select_related("vocabulary")
            .order_by("-last_reviewed_at")
        )

        data = [
            {
                "vocabulary_id": item.vocabulary_id,
                "simplified": item.vocabulary.simplified,
                "pinyin": item.vocabulary.pinyin,
                "correct_count": item.correct_count,
                "incorrect_count": item.incorrect_count,
                "last_reviewed_at": item.last_reviewed_at,
            }
            for item in progress
        ]

        serializer = UserProgressSerializer(
            data,
            many=True,
        )

        return Response(serializer.data)