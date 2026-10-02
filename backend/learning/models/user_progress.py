from django.conf import settings
from django.db import models


class UserProgress(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="vocabulary_progress",
    )

    vocabulary = models.ForeignKey(
        "Vocabulary",
        on_delete=models.CASCADE,
        related_name="user_progress",
    )

    correct_count = models.PositiveIntegerField(
        default=0,
    )

    incorrect_count = models.PositiveIntegerField(
        default=0,
    )

    last_reviewed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    next_review_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "vocabulary"],
                name="unique_user_vocabulary_progress",
            ),
        ]

    def __str__(self):
        return f"{self.user} - {self.vocabulary}"