# LOKANITY: Flask + SQLite backend

## Quick start
    pip install -r requirements.txt
    python run.py
Open http://127.0.0.1:5000 (open the site through Flask, not by double-clicking the .html files).

## Project layout
    run.py                 start the server
    init_db.py             create/update the database without starting the server
    config.py              all settings (override with environment variables, see .env.example)
    app/
      __init__.py          app factory (create_app)
      db.py                database layer: connections + migration runner + `flask init-db`
      auth.py              login module routes: /api/signup /login /logout /me
      validators.py        email / nickname / password rules
      errors.py            JSON error handling
      repositories/
        users.py           ALL SQL for the users table
    migrations/
      001_create_users.sql database schema, versioned
    instance/
      lokanity.db          the SQLite database (already created, empty)
      secret.key           created automatically on first run (do not share)
    static/                the website: index, explore, ask, guides, saved (.html) + script.js + style.css
    tests/                 automated tests:  python -m pytest

## Database
- File: instance/lokanity.db (change location with DATABASE_PATH)
- Tables: `users`, plus `schema_migrations` (tracks which migrations were applied)
- `users`: id, email (unique), nickname (unique), password_hash, city, created_at, last_login_at
- Passwords are stored hashed (scrypt), never as plain text.

### Adding to the database later (posts, saved places, ...)
1. Add a new file in `migrations/`, e.g. `002_create_posts.sql` (numbers keep the order).
2. Restart the app (or run `python init_db.py`). It is applied automatically, exactly once.
3. Add `app/repositories/posts.py` for its SQL and a blueprint like `app/auth.py` for its routes.
Never edit a migration that has already been applied. Add a new one instead.

### Backup
Stop the app (or use SQLite's backup) and copy instance/lokanity.db.

## API
    POST /api/signup  {email, nickname, password, city?}   -> 201 {user}
    POST /api/login   {email, password}                    -> 200 {user}
    POST /api/logout                                       -> 200
    GET  /api/me                                           -> 200 {user} or 401
Errors look like {"error": "message", "field": "email|nickname|password|null"}.

## Rules
- Email: name@domain.tld (needs @, a domain and a 2+ letter ending)
- Nickname: 3-20 letters/numbers/underscores. Password: 6+ characters.
- Email and nickname can't be registered twice (case-insensitive).
- 5 wrong logins in 5 minutes temporarily blocks that email + IP.

## Going live
Set SECRET_KEY, COOKIE_SECURE=1 (HTTPS) and run with gunicorn:
    gunicorn run:app
Hosts that wipe local files on restart need a persistent disk for instance/.

## Speed notes
The site is tuned for slow devices without changing how it looks or behaves:
- `static/logo.png` is the logo that used to be embedded inside `style.css` (same pixels, loaded separately and cached).
- `app/static_fast.py` compresses the files in `static/` (gzip; Brotli too if you `pip install Brotli`) and lets browsers cache
  `style.css`, `script.js` and `logo.png` for a year. The links inside the pages get a `?v=...` fingerprint automatically,
  so when you edit a file visitors still get the new version straight away. Nothing on disk is modified.
- `script.js`: the login-screen city scene is only built when it is actually on screen.
- `static/logo-inline.css` is only used if you open an .html file straight from disk (double-click): browsers block `logo.png` there, so this embeds the same logo. When served by Flask it is never loaded.
