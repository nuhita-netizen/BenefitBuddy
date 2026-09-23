from .database import engine, SessionLocal
from . import models

def seed_database():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if we already have schemes
    if db.query(models.SchemeDB).count() > 0:
        print("Database already seeded.")
        db.close()
        return

    schemes = [
        models.SchemeDB(
            name="PM-KISAN",
            description="Pradhan Mantri Kisan Samman Nidhi",
            max_land_acres=5.0, # Approximate for 2 hectares
            target_occupation="farmer"
        ),
        models.SchemeDB(
            name="Ayushman Bharat",
            description="National Health Protection Scheme",
            max_income=500000
        ),
        models.SchemeDB(
            name="PMAY",
            description="Pradhan Mantri Awas Yojana",
            # General housing scheme, maybe no strict filters for testing
        ),
        models.SchemeDB(
            name="Sukanya Samriddhi Yojana",
            description="Girl Child Prosperity Scheme",
            max_age=10,
            target_gender="female"
        ),
        models.SchemeDB(
            name="SC/ST Scholarship",
            description="Pre-Matric Scholarship for SC/ST students",
            min_age=10,
            max_age=16,
            target_category="sc,st"
        )
    ]

    for scheme in schemes:
        db.add(scheme)
    
    db.commit()
    db.close()
    print("Successfully seeded database with schemes.")

if __name__ == "__main__":
    seed_database()
