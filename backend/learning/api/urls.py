from django.urls import path

from .views import ( 
    HSKLevelListView, 
    QuizAnswerView, 
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