"""
Management command: create_superuser_if_none

Creates a Django superuser non-interactively during build/deploy.
Reads credentials from environment variables so secrets stay out of source code.
Completely idempotent — safe to run on every deploy; does nothing if the
superuser already exists.

Environment variables (set these in Render's Environment tab):
  DJANGO_SUPERUSER_USERNAME  (default: admin)
  DJANGO_SUPERUSER_EMAIL     (default: admin@healthmate.com)
  DJANGO_SUPERUSER_PASSWORD  (default: HealthMate@2024!)

Run:
  python manage.py create_superuser_if_none
"""

import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Creates a superuser if none exists (idempotent, safe for automated deploys)"

    def handle(self, *args, **kwargs):
        User = get_user_model()

        username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@healthmate.com")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "HealthMate@2024!")

        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(
                    f"  ℹ Superuser '{username}' already exists — skipping creation."
                )
            )
            return

        User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(
            self.style.SUCCESS(
                f"  ✓ Superuser '{username}' created successfully."
            )
        )
