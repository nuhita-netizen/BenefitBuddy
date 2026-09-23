from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from . import models
from .database import engine, get_db
from .rules_engine import check_eligibility
from .gemini_service import generate_explanation

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="BenefitBuddy API")

@app.post("/users", response_model=models.UserResponse)
def create_user(user: models.UserCreate, db: Session = Depends(get_db)):
    db_user = models.UserDB(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/schemes", response_model=List[models.SchemeResponse])
def list_schemes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    schemes = db.query(models.SchemeDB).offset(skip).limit(limit).all()
    return schemes

@app.post("/schemes", response_model=models.SchemeResponse)
def add_scheme(scheme: models.SchemeCreate, db: Session = Depends(get_db)):
    db_scheme = models.SchemeDB(**scheme.model_dump())
    db.add(db_scheme)
    db.commit()
    db.refresh(db_scheme)
    return db_scheme

@app.post("/eligibility/check/{user_id}")
def check_eligibility_for_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.UserDB).filter(models.UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    schemes = db.query(models.SchemeDB).all()
    
    results = []
    
    for scheme in schemes:
        is_eligible, reason = check_eligibility(user, scheme)
        explanation = generate_explanation(user.name, scheme.name, is_eligible, reason)
        
        # Log the interaction
        log_entry = models.InteractionLogDB(
            user_id=user.id,
            scheme_name=scheme.name,
            is_eligible=is_eligible,
            deterministic_reason=reason,
            ai_explanation=explanation
        )
        db.add(log_entry)
        
        results.append({
            "scheme_name": scheme.name,
            "is_eligible": is_eligible,
            "deterministic_reason": reason,
            "ai_explanation": explanation
        })
        
    db.commit()
    
    return {"user_id": user.id, "results": results}

@app.get("/users/{user_id}/history", response_model=List[models.InteractionLogResponse])
def get_user_history(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.UserDB).filter(models.UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    history = db.query(models.InteractionLogDB).filter(models.InteractionLogDB.user_id == user_id).order_by(models.InteractionLogDB.timestamp.desc()).all()
    return history
