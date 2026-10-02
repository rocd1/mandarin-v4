from django.db import models


class HSKLevel(models.Model):
    name = models.CharField(
        max_length=50,
        unique=True,
    )

    order = models.PositiveIntegerField(
        unique=True,
    )

    description = models.TextField(
        blank=True,
    )

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.name