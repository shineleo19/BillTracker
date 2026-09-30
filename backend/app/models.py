from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String) # Stored as a secure BCrypt hash
    role = Column(String, default="Member") # Admin, Captain, Member
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=True)

class Club(Base):
    __tablename__ = "clubs"
    id = Column(Integer, primary_key=True, index=True)
    club_name = Column(String, index=True)
    competition = Column(String)
    department = Column(String)
    captain_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    bills = relationship("Bill", back_populates="club")

class Bill(Base):
    __tablename__ = "bills"
    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(Integer, ForeignKey("clubs.id"))
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    material_name = Column(String, index=True)
    vendor = Column(String)
    invoice_number = Column(String)
    quantity = Column(Integer)
    price = Column(Float)
    gst = Column(Float)
    total = Column(Float)
    purchase_date = Column(Date)
    category = Column(String)
    project_phase = Column(String)
    bill_image = Column(String)
    description = Column(Text)
    status = Column(String, default="Pending")
    
    club = relationship("Club", back_populates="bills")