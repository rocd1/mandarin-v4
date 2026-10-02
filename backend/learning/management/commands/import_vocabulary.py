import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from learning.models import HSKLevel, Vocabulary


class Command(BaseCommand):
    help = "Import HSK vocabulary from JSON files."

    HSK_LEVELS = {
        1: ("HSK 1", 1),
        2: ("HSK 2", 2),
        3: ("HSK 3", 3),
        4: ("HSK 4", 4),
        5: ("HSK 5", 5),
        6: ("HSK 6", 6),
        7: ("HSK 7–9", 7),
    }

    def handle(self, *args, **options):
        data_directory = (
            Path(__file__).resolve().parents[2]
            / "data"
            
        )

        total_created = 0
        total_updated = 0
        total_skipped = 0

        for level_number, (level_name, order) in self.HSK_LEVELS.items():
            file_path = data_directory / f"{level_number}.json"

            if not file_path.exists():
                raise CommandError(
                    f"Missing vocabulary file: {file_path}"
                )

            hsk_level, _ = HSKLevel.objects.get_or_create(
                name=level_name,
                defaults={
                    "order": order,
                },
            )

            self.stdout.write(
                f"\nImporting {level_name}..."
            )

            created, updated, skipped = self._import_file(
                file_path=file_path,
                hsk_level=hsk_level,
            )

            total_created += created
            total_updated += updated
            total_skipped += skipped

            self.stdout.write(
                self.style.SUCCESS(
                    f"{level_name}: "
                    f"{created} created, "
                    f"{updated} updated, "
                    f"{skipped} skipped"
                )
            )

        self.stdout.write("\nImport complete.")
        self.stdout.write(
            self.style.SUCCESS(
                f"Created: {total_created}"
            )
        )
        self.stdout.write(
            f"Updated: {total_updated}"
        )
        self.stdout.write(
            f"Skipped: {total_skipped}"
        )

    def _import_file(
        self,
        file_path: Path,
        hsk_level: HSKLevel,
    ) -> tuple[int, int, int]:
        try:
            with file_path.open(
                "r",
                encoding="utf-8",
            ) as file:
                entries = json.load(file)

        except json.JSONDecodeError as exc:
            raise CommandError(
                f"Invalid JSON in {file_path}: {exc}"
            ) from exc

        if not isinstance(entries, list):
            raise CommandError(
                f"Expected a JSON list in {file_path}"
            )

        created = 0
        updated = 0
        skipped = 0

        for entry in entries:
            if not isinstance(entry, dict):
                skipped += 1
                continue

            simplified = entry.get("simplified", "").strip()

            if not simplified:
                skipped += 1
                continue

            forms = entry.get("forms", [])

            if not isinstance(forms, list) or not forms:
                skipped += 1
                continue

            form = forms[0]

            if not isinstance(form, dict):
                skipped += 1
                continue

            transcriptions = form.get(
                "transcriptions",
                {},
            )

            if not isinstance(transcriptions, dict):
                skipped += 1
                continue

            pinyin = transcriptions.get(
                "pinyin",
                "",
            ).strip()

            meanings = form.get(
                "meanings",
                [],
            )

            if not pinyin or not meanings:
                skipped += 1
                continue

            meanings = [
                meaning.strip()
                for meaning in meanings
                if isinstance(meaning, str)
                and meaning.strip()
            ]

            if not meanings:
                skipped += 1
                continue

            traditional = form.get(
                "traditional",
                "",
            ).strip()

            pinyin_numeric = transcriptions.get(
                "numeric",
                "",
            ).strip()

            part_of_speech = entry.get(
                "pos",
                [],
            )

            if not isinstance(part_of_speech, list):
                part_of_speech = []

            part_of_speech = [
                value.strip()
                for value in part_of_speech
                if isinstance(value, str)
                and value.strip()
            ]

            radical = entry.get(
                "radical",
                "",
            ).strip()

            frequency = entry.get("frequency")

            vocabulary, was_created = (
                Vocabulary.objects.update_or_create(
                    simplified=simplified,
                    defaults={
                        "traditional": traditional,
                        "pinyin": pinyin,
                        "pinyin_numeric": pinyin_numeric,
                        "meanings": meanings,
                        "part_of_speech": part_of_speech,
                        "radical": radical,
                        "frequency": frequency,
                        "hsk_level": hsk_level,
                    },
                )
            )

            if was_created:
                created += 1
            else:
                updated += 1

        return created, updated, skipped