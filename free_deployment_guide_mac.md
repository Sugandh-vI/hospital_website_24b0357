# Free deployment guide (macOS) — Render + Netlify + Supabase

> **macOS notes:** All terminal commands below use the built-in **Terminal** app (Applications → Utilities → Terminal, or Spotlight search). macOS ships with `python3`, not `python`, so commands use `python3` throughout. If you use a virtual environment (`venv`), activate it with `source venv/bin/activate` before running any `python3 manage.py ...` commands.

## Architecture

```
Browser
  ├── Netlify (React frontend)   — free, no credit card, global CDN
  ├── Render  (Django backend)   — free, no credit card, spins down when idle
  └── Supabase (PostgreSQL)      — free, no credit card, 500MB
```

---

## Before you start

You need:
- A GitHub account
- Your backend and frontend code pushed to GitHub (one repo with two folders)

Push your code if you haven't yet:
```bash
# From your project root
git init
git add .
git commit -m "initial commit"
# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```
double check if environment variables are there on github(you don't want them to be public.) 
---

## Phase 1 — Supabase (PostgreSQL database)

### 1.1 Create the database

1. Go to https://supabase.com → **Start your project** → sign up with GitHub
2. Click **New project**
   - Name: `course-db`
   - Database password: something strong with only letters and numbers (avoid special characters — they cause URL encoding headaches)
   - Region: pick the one closest to your students
3. Wait ~2 minutes for provisioning
4. Go to **Your Project → connect → direct**
5. Switch your connection method in Supabase to the Transaction Pooler (which uses pooler.supabase.com and port 6543) to force an IPv4 connection
6. Scroll to **Connection string → URI** and copy it — looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefgh.supabase.co:5432/postgres
   ```
   Note the square brackets are not to be included in the url.
   Save this — it's your `DATABASE_URL`.

---

## Phase 2 — Prepare the backend

These are code changes to make before deploying to Render.

### 2.1 Add production packages

```bash
cd backend
python3 -m pip install gunicorn whitenoise dj-database-url
python3 -m pip freeze > requirements.txt
```
Note only use `pip freeze` if all libraries in your global as well as local environment are being used.
### 2.2 Create a `build.sh` script

Render runs this once on every deploy. Create `backend/build.sh`:

```bash
#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
```

Make it executable:
```bash
git update-index --chmod=+x build.sh
```

### 2.3 Update settings.py

Replace the `DATABASES` block and add the production settings below.
Everything is driven by environment variables so local dev is unchanged.

```python
import os
import dj_database_url

# --- Replace your DATABASES block with this ---
DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            ssl_require=True,
        )
    }
# If DATABASE_URL is not set (local dev), the original psycopg2 config below is used
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': config('DB_NAME'),
            'USER': config('DB_USER'),
            'PASSWORD': config('DB_PASSWORD'),
            'HOST': config('DB_HOST', default='localhost'),
            'PORT': config('DB_PORT', default='5432'),
        }
    }

# --- Add these production settings at the bottom of settings.py ---

# Whitenoise serves Django admin static files without a separate file server
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Render sets this env var — switch off DEBUG automatically in production
if os.environ.get('RENDER'):
    DEBUG = False
    ALLOWED_HOSTS = ['*']   # tighten to your Render URL after first deploy
```

### 2.4 Create a `Procfile` (tells Render how to start the server)

Create `backend/Procfile` (no file extension):
```
web: gunicorn config.wsgi:application
```

### 2.5 Specify the Python version

Create `backend/runtime.txt`:
```
python-3.12.3
```

### 2.6 Commit and push everything

```bash
cd backend
git add .
git commit -m "add render deployment files"
git push
```

---

## Phase 3 — Deploy backend on Render

### 3.1 Create a Render account

1. Go to https://render.com → **Get Started for Free**
2. Sign up with your GitHub account — no credit card needed

### 3.2 Create a new Web Service

1. Dashboard → **New +** → **Web Service**
2. Click **Connect** next to your GitHub repo
3. If your backend is in a subfolder (e.g. `backend/`), set **Root Directory** to `backend`
4. Fill in the settings:

   | Field | Value |
   |---|---|
   | Name | `course-backend` |
   | Region | Pick closest to students |
   | Branch | `main` |
   | Runtime | `Python 3` |
   | Build Command | `./build.sh` |
   | Start Command | `gunicorn config.wsgi:application` |
   | Instance Type | **Free** |

5. Scroll down to **Environment Variables** — click **Add Environment Variable** for each:

   | Key | Value |
   |---|---|
   | `SECRET_KEY` | Run locally in Terminal: `python3 -c "import secrets; print(secrets.token_hex(32))"` and paste the result |
   | `DATABASE_URL` | Your Supabase connection string from Phase 1 |
   | `GOOGLE_CLIENT_ID` | Your OAuth Client ID from Google Cloud Console |
   | `CORS_ALLOWED_ORIGINS` | `https://PLACEHOLDER` (update after frontend deploy) |
   | `RENDER` | `true` |

auth id is only for google authentication.
6. Click **Create Web Service**

Render will build and deploy — takes 2–4 minutes. Watch the log stream.
When you see `==> Your service is live ` the URL is shown at the top — looks like:
```
https://course-backend-xxxx.onrender.com
```
**Save this URL.**

### 3.3 Create the superuser

Render's free tier doesn't have a console, so use the Shell tab:

1. Open **Terminal** (Spotlight → type "Terminal" → Enter), and `cd` into your `backend` folder.
2. Run:
   ```bash
   export DATABASE_URL="postgresql://postgres.ncltnbwemldlyxifpcya:YourRealPassword@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
   python3 manage.py createsuperuser
   ```
   Enter your email and password when prompted. This will be the login for the Django backend admin page.

   > If your virtual environment isn't active yet, activate it first: `source venv/bin/activate` (adjust the path to match your project).

### 3.5 Verify

Open `https://course-backend-xxxx.onrender.com/admin/` — you should see the Django admin login page.

---

## Phase 4 — Prepare the frontend

### 4.1 Add a production environment file

Create `frontend/.env.production`:
```
VITE_API_BASE_URL=https://course-backend-xxxx.onrender.com
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```
google id is only for google authentication.
Replace with your actual Render backend URL.

### 4.2 Add a `_redirects` file for React Router

Netlify needs this so that refreshing `/resources` doesn't 404.
Create `frontend/public/_redirects`:
```
/*    /index.html    200
```

### 4.3 Commit and push

```bash
cd frontend
git add .
git commit -m "add netlify redirect and production env"
git push
```

---

## Phase 5 — Deploy frontend on Netlify

### 5.1 Create a Netlify account

1. Go to https://netlify.com → **Sign up** → use GitHub
2. No credit card required

### 5.2 Import your project

1. Dashboard → **Add new site** → **Import an existing project**
2. Choose **GitHub** → select your repo
3. If frontend is in a subfolder, set **Base directory** to `frontend` (the name of the folder of frontend)
4. Fill in the build settings:

   | Field | Value |
   |---|---|
   | Build command | `npm run build` |
   | Publish directory | `dist` |

5. Click **Add environment variables** and add:

   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://course-backend-xxxx.onrender.com` |
   | `VITE_GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |

6. Click **Deploy site**

Takes ~1 minute. Netlify gives you a URL like:
```
https://glittery-dolphin-abc123.netlify.app
```
You can rename it: **Site configuration → Change site name** → `studentlearninghub.netlify.app`.

**Save this URL — it's your site.**

---

## Phase 6 — Wire everything together

### 6.1 Update CORS on the backend

1. Go to Render dashboard → your backend service → **Environment**
2. Update `CORS_ALLOWED_ORIGINS` to your Netlify URL:
   ```
   https://studentlearninghub.netlify.app
   ```
3. Click **Save Changes** — Render redeploys automatically

### 6.2 Update Google OAuth authorised origins

1. Go to https://console.cloud.google.com → **APIs & Services** → **Credentials**
2. Click your OAuth 2.0 Client ID
3. Under **Authorised JavaScript origins** add your Netlify URL:
   ```
   https://studentlearninghub.netlify.app
   ```
4. Save

### 6.3 Done

Your site is live. Share the Netlify URL with students.

---

## Redeployment — making updates

Both services auto-deploy from GitHub — just push:

```bash
# Backend change
cd backend
git add . && git commit -m "update" && git push
# Render detects the push and redeploys automatically

# Frontend change
cd frontend
git add . && git commit -m "update" && git push
# Netlify detects the push and redeploys automatically
```

No manual steps needed after the initial setup.

---

## Important: Render free tier spin-down

Render's free web services spin down after 15 minutes of inactivity.
The first request after idle takes ~30–50 seconds to wake up.

For a course site used regularly by students during class this is fine —
once one student hits it, it stays warm for everyone else.

If spin-down is a problem, two options:
1. **Upgrade to Render Starter** ($7/month) — no spin-down
2. **Use UptimeRobot** (free) — pings your backend URL every 5 minutes to keep it awake:
   This keeps the service warm at zero cost.

---
