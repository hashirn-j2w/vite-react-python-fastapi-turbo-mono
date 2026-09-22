from datetime import UTC, datetime
from itertools import count
from typing import Annotated

from fastapi import Depends

from api.items.schemas import Item, ItemCreate


class ItemRepository:
    """In-memory store. Swap for a real database layer; routes only see this interface."""

    def __init__(self, seed: list[ItemCreate] | None = None) -> None:
        self._items: dict[int, Item] = {}
        self._ids = count(1)
        for data in seed or []:
            self.add_item(data)

    def list_items(self, *, q: str | None = None, limit: int = 50) -> list[Item]:
        items = list(self._items.values())
        if q:
            needle = q.casefold()
            items = [item for item in items if needle in item.name.casefold()]
        return items[:limit]

    def get_item(self, item_id: int) -> Item | None:
        return self._items.get(item_id)

    def add_item(self, data: ItemCreate) -> Item:
        item = Item(id=next(self._ids), created_at=datetime.now(UTC), **data.model_dump())
        self._items[item.id] = item
        return item

    def remove_item(self, item_id: int) -> bool:
        return self._items.pop(item_id, None) is not None


_repository = ItemRepository(
    seed=[
        ItemCreate(name="Keyboard", description="Mechanical, brown switches", tags=["hardware"]),
        ItemCreate(name="Monitor", quantity=2, tags=["hardware", "display"]),
    ]
)


def get_item_repository() -> ItemRepository:
    return _repository


ItemRepositoryDep = Annotated[ItemRepository, Depends(get_item_repository)]
