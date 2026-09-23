from typing import Tuple
from .models import UserDB, SchemeDB

def check_eligibility(user: UserDB, scheme: SchemeDB) -> Tuple[bool, str]:
    """
    Evaluates a user against a scheme's deterministic criteria.
    Returns (is_eligible, reason_string)
    """
    reasons = []

    if scheme.min_age is not None and user.age < scheme.min_age:
        reasons.append(f"Age {user.age} is below minimum {scheme.min_age}.")
    
    if scheme.max_age is not None and user.age > scheme.max_age:
        reasons.append(f"Age {user.age} is above maximum {scheme.max_age}.")

    if scheme.target_gender is not None and user.gender.lower() != scheme.target_gender.lower():
        reasons.append(f"Gender '{user.gender}' does not match required '{scheme.target_gender}'.")

    if scheme.max_income is not None and user.annual_income > scheme.max_income:
        reasons.append(f"Annual income {user.annual_income} exceeds maximum {scheme.max_income}.")

    if scheme.target_state is not None and user.state.lower() != scheme.target_state.lower():
        reasons.append(f"State '{user.state}' does not match required '{scheme.target_state}'.")

    if scheme.target_category is not None:
        categories = [c.strip().lower() for c in scheme.target_category.split(",")]
        if user.category.lower() not in categories:
            reasons.append(f"Category '{user.category}' is not eligible. Eligible categories: {scheme.target_category}.")

    if scheme.max_land_acres is not None and user.land_holding_acres > scheme.max_land_acres:
        reasons.append(f"Land holding {user.land_holding_acres} acres exceeds maximum {scheme.max_land_acres} acres.")

    if scheme.target_occupation is not None and user.occupation.lower() != scheme.target_occupation.lower():
        reasons.append(f"Occupation '{user.occupation}' does not match required '{scheme.target_occupation}'.")

    if not reasons:
        return True, "Eligible based on all criteria."
    else:
        return False, " | ".join(reasons)
