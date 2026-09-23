from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List
from .database import Base

# --- SQLAlchemy Models ---

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    gender = Column(String)  # e.g., 'male', 'female', 'other'
    annual_income = Column(Float)
    state = Column(String)
    category = Column(String)  # e.g., 'general', 'obc', 'sc', 'st'
    land_holding_acres = Column(Float)
    occupation = Column(String)

    history = relationship("InteractionLogDB", back_populates="user")

class SchemeDB(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    
    # Deterministic criteria
    min_age = Column(Integer, nullable=True)
    max_age = Column(Integer, nullable=True)
    target_gender = Column(String, nullable=True)
    max_income = Column(Float, nullable=True)
    target_state = Column(String, nullable=True)
    target_category = Column(String, nullable=True) # Could be comma separated like 'sc,st'
    max_land_acres = Column(Float, nullable=True)
    target_occupation = Column(String, nullable=True)

class InteractionLogDB(Base):
    __tablename__ = "interaction_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    scheme_name = Column(String)
    is_eligible = Column(Boolean)
    deterministic_reason = Column(String)
    ai_explanation = Column(String)

    user = relationship("UserDB", back_populates="history")


# --- Pydantic Models ---

class UserBase(BaseModel):
    name: str
    age: int
    gender: str
    annual_income: float
    state: str
    category: str
    land_holding_acres: float
    occupation: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class SchemeBase(BaseModel):
    name: str
    description: str
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    target_gender: Optional[str] = None
    max_income: Optional[float] = None
    target_state: Optional[str] = None
    target_category: Optional[str] = None
    max_land_acres: Optional[float] = None
    target_occupation: Optional[str] = None

class SchemeCreate(SchemeBase):
    pass

class SchemeResponse(SchemeBase):
    id: int

    class Config:
        from_attributes = True

class InteractionLogResponse(BaseModel):
    id: int
    timestamp: datetime
    scheme_name: str
    is_eligible: bool
    deterministic_reason: str
    ai_explanation: str

    class Config:
        from_attributes = True
