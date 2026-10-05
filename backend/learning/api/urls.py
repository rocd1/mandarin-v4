from django.urls import path

from .views import ( 
    HSKLevelListView,
    QuizAnswerView, 
    QuizQuestionListView,
    QuizQuestionView, 
    StudyWordListView, 
    UserProgressView,
)    


urlpatterns = [
    path(
        "levels/",
        HSKLevelListView.as_view(),
        name="hsk-levels",
    ),
    path(
        "study/",
        StudyWordListView.as_view(),
        name="study-words",
    ),

    path(
        "quiz/question/",
        QuizQuestionView.as_view(),
        name="quiz-question",
    ),
    path(
        "quiz/questions/",
        QuizQuestionListView.as_view(),
        name="quiz-questions",
    ),
    path(
        "quiz/answer/",
        QuizAnswerView.as_view(),
        name="quiz-answer",
    ),
    path(
        "progress/",
        UserProgressView.as_view(),
        name="user-progress",
    ),
]