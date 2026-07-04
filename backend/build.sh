#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
# --clear ensures old hashed files don't linger; fresh manifest every deploy
python manage.py collectstatic --noinput --clear
python manage.py migrate
