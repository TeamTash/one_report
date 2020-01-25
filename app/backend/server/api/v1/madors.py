# pylint: disable=unused-argument
"""Madors api requests."""
from typing import List
from sqlalchemy.orm import Session
from fastapi import APIRouter, Security, Depends

from db import schemas
from db.database import get_db
from server import auth

router = APIRouter()


@router.get("/hierarchy", response_model=List[schemas.Hierarchy])
async def post_users(
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
):
    pass
    # return crud.get_hierarchy(
    #     db=db,
    #     leader_id=
    # )