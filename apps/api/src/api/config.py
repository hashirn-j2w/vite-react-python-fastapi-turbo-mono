from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict

API_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    """Runtime configuration, read from `API_*` environment variables and `apps/api/.env`."""

    model_config = SettingsConfigDict(env_prefix="API_", env_file=API_DIR / ".env", extra="ignore")

    # Keep anything that changes the OpenAPI schema (title, routes, models) out of
    # settings, so the exported openapi.json is identical on every machine.
    environment: Literal["local", "staging", "production"] = "local"
    # JSON list in env, e.g. API_CORS_ORIGINS='["https://app.example.com"]'.
    # Local dev doesn't need CORS: Vite proxies /api to this server.
    cors_origins: list[str] = []


@lru_cache
def get_settings() -> Settings:
    return Settings()
