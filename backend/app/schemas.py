from pydantic import BaseModel
from typing import Optional
from datetime import date

# --- Club Schemas ---
class ClubBase(BaseModel):
    club_name: str
    competition: str
    department: str
    captain_id: int

class ClubCreate(ClubBase):
    pass

class ClubResponse(ClubBase):
    id: int
    class Config:
        from_attributes = True

# --- Bill Schemas ---
class BillBase(BaseModel):
    club_id: int
    uploaded_by: int
    material_name: str
    vendor: str
    invoice_number: str
    quantity: int
    price: float
    gst: float
    total: float
    purchase_date: date
    category: str
    project_phase: str
    bill_image: str
    description: Optional[str] = None

class BillCreate(BillBase):
    pass

class BillResponse(BillBase):
    id: int
    status: str
    class Config:
        from_attributes = True