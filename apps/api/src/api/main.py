from importlib.metadata import version

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute

from api.config import get_settings
from api.health import router as health_router
from api.items.router import router as items_router


def generate_operation_id(route: APIRoute) -> str:
    """Use the route function's name as the OpenAPI operationId.

    Generated TS clients then get clean names (`list_items` -> `listItems`,
    `listItemsOptions`, ...) instead of FastAPI's default
    `list_items_api_items_get`. Route function names must therefore be unique
    across the app (FastAPI warns about duplicate operation IDs).
    """
    return route.name


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="API",
        version=version("api"),
        openapi_url="/api/openapi.json",
        docs_url="/api/docs",
        redoc_url=None,
        generate_unique_id_function=generate_operation_id,
    )

    if settings.cors_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.cors_origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    app.include_router(health_router, prefix="/api")
    app.include_router(items_router, prefix="/api")
    return app


app = create_app()
