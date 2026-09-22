from typing import Annotated, Any

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from api.items.repository import ItemRepositoryDep
from api.items.schemas import Item, ItemCreate

router = APIRouter(prefix="/items", tags=["items"])


class HTTPError(BaseModel):
    detail: str


NOT_FOUND: dict[int | str, dict[str, Any]] = {
    status.HTTP_404_NOT_FOUND: {"model": HTTPError, "description": "Item not found"}
}


@router.get("")
async def list_items(
    repo: ItemRepositoryDep,
    q: Annotated[
        str | None, Query(max_length=100, description="Case-insensitive name filter")
    ] = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
) -> list[Item]:
    return repo.list_items(q=q, limit=limit)


@router.get("/{item_id}", responses=NOT_FOUND)
async def get_item(item_id: int, repo: ItemRepositoryDep) -> Item:
    item = repo.get_item(item_id)
    if item is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Item not found")
    return item


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_item(payload: ItemCreate, repo: ItemRepositoryDep) -> Item:
    return repo.add_item(payload)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT, responses=NOT_FOUND)
async def delete_item(item_id: int, repo: ItemRepositoryDep) -> None:
    if not repo.remove_item(item_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Item not found")
