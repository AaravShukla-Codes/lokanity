"""Central configuration. Override anything with environment variables (see .env.example)."""
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
INSTANCE_DIR = os.environ.get("INSTANCE_DIR", os.path.join(BASE_DIR, "instance"))


class Config:
    # --- database ---
    DATABASE = os.environ.get("DATABASE_PATH", os.path.join(INSTANCE_DIR, "lokanity.db"))
    MIGRATIONS_DIR = os.path.join(BASE_DIR, "migrations")
    AUTO_MIGRATE = True  # apply new migrations automatically on startup

    # --- sessions / security ---
    SECRET_KEY = os.environ.get("SECRET_KEY")  # if empty, one is created in instance/secret.key
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = os.environ.get("COOKIE_SECURE") == "1"  # set to 1 on HTTPS
    PERMANENT_SESSION_LIFETIME_DAYS = 30
    MAX_CONTENT_LENGTH = 16 * 1024

    # --- auth rules ---
    MIN_PASSWORD = 6
    MAX_PASSWORD = 128
    LOGIN_MAX_FAILS = 5
    LOGIN_WINDOW_SECONDS = 300

    # --- paths ---
    INSTANCE_DIR = INSTANCE_DIR
    STATIC_DIR = os.path.join(BASE_DIR, "static")
