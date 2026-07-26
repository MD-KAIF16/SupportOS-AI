from pydantic import BaseModel
from typing import Optional


class TicketCreate(BaseModel):
    title: str
    description: str


class TicketResponse(BaseModel):
    id: str
    title: str
    description: str
    status: str


class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None