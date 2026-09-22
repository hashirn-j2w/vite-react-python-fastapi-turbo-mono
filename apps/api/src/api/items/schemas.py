from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ItemCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    quantity: int = Field(default=1, ge=1, le=10_000)
    tags: list[str] = Field(default_factory=list, max_length=10)


class Item(ItemCreate):
    # Responses always include defaulted fields; mark them required in the
    # schema so generated TS types aren't needlessly optional.
    model_config = ConfigDict(json_schema_serialization_defaults_required=True)

    id: int
    created_at: datetime
