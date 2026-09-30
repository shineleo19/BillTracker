import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app import models
from app import schemas
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer

# JWT Secret Configuration (Keep secure in production)
SECRET_KEY = "super-secret-hackathon-key"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- UPDATED DATABASE CONFIGURATION ---
# Use the environment variable if on Render, otherwise use your Supabase URL, 
# or fallback to SQLite for local development.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres.mqmqbfudrrffqnogehey:Happymonday%40001@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"  # Paste your Supabase ORM connection string here
)

# SQLAlchemy requires postgresql:// instead of postgres://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)
elif DATABASE_URL.startswith("postgresql://") and not DATABASE_URL.startswith("postgresql+psycopg2://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# --------------------------------------

app = FastAPI(title="Student Team Bill Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173","*"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables directly (skipping Alembic for the hackathon speed)
models.Base.metadata.create_all(bind=engine)

# Helper for password verification
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Login Schema 
from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/login")
def login(form_data: LoginRequest, db: Session = Depends(get_db)):
    # Find user by email
    user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # Generate JWT Token valid for 24 hours
    expiration = datetime.utcnow() + timedelta(days=1)
    token_data = {"sub": user.email, "role": user.role, "club_id": user.club_id, "exp": expiration}
    access_token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "role": user.role, 
        "club_id": user.club_id,
        "name": user.name
    }

# --- Club Endpoints ---

@app.post("/clubs/", response_model=schemas.ClubResponse)
def create_club(club: schemas.ClubCreate, db: Session = Depends(get_db)):
    db_club = models.Club(**club.model_dump())
    db.add(db_club)
    db.commit()
    db.refresh(db_club)
    return db_club

@app.post("/seed-admin")
def seed_admin(db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == "captain@bajateam.com").first()
    if existing_user:
        return {"message": "Test user already exists! You can log in."}
    
    hashed_pw = get_password_hash("password123")
    admin_user = models.User(
        name="Shine Leo A C",
        email="captain@bajateam.com",
        password=hashed_pw,
        role="Captain",
        club_id=1
    )
    db.add(admin_user)
    db.commit()
    return {"message": "Test user created successfully!"}

@app.get("/clubs/", response_model=list[schemas.ClubResponse])
def get_clubs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Club).offset(skip).limit(limit).all()

# --- Bill Endpoints ---

@app.post("/bills/", response_model=schemas.BillResponse)
def upload_bill(bill: schemas.BillCreate, db: Session = Depends(get_db)):
    # Calculate total on backend for security
    calculated_total = (bill.price * bill.quantity) + bill.gst
    bill_data = bill.model_dump()
    bill_data['total'] = calculated_total
    
    db_bill = models.Bill(**bill_data)
    db.add(db_bill)
    db.commit()
    db.refresh(db_bill)
    return db_bill

@app.get("/bills/club/{club_id}", response_model=list[schemas.BillResponse])
def get_club_bills(club_id: int, db: Session = Depends(get_db)):
    # Multi-tenant isolation: Only fetch bills for the requested club ID
    bills = db.query(models.Bill).filter(models.Bill.club_id == club_id).all()
    if not bills:
        raise HTTPException(status_code=404, detail="No bills found for this club")
    return bills