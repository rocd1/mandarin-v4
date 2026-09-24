from django.urls import path

from accounts.views.test import ProtectedTestView



urlpatterns = [
    path(
        "test/protected/",
        ProtectedTestView.as_view(),
        name="protected-test",
    ),
    
]