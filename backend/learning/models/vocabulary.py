from django.db import models


class Vocabulary(models.Model):
    simplified = models.CharField(
        max_length=100,
    )

    traditional = models.CharField(
        max_length=100,
        blank=True,
    )

    pinyin = models.CharField(
        max_length=200,
    )

    pinyin_numeric = models.CharField(
        max_length=200,
        blank=True,
    )

    meanings = models.JSONField(
        default=list,
    )

    part_of_speech = models.JSONField(
        default=list,
    )

    radical = models.CharField(
        max_length=20,
        blank=True,
    )

    frequency = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    hsk_level = models.ForeignKey(
        "HSKLevel",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="vocabulary",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["frequency", "simplified"]
        indexes = [
            models.Index(
                fields=["simplified"],
            ),
            models.Index(
                fields=["hsk_level"],
            ),
        ]

    def __str__(self):
        return self.simplified