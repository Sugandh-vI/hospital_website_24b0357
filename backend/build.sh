#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
# --clear ensures old hashed files don't linger; fresh manifest every deploy
python manage.py collectstatic --noinput --clear
python manage.py migrate

# ── ONE-TIME SETUP (idempotent — safe on every run, but remove after first
#    successful deploy to keep builds fast) ───────────────────────────────────
python manage.py seed_data
python manage.py create_superuser_if_none
# ── END ONE-TIME SETUP ───────────────────────────────────────────────────────

