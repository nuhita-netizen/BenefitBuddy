import requests

def test():
    # Create user
    res = requests.post("http://127.0.0.1:8000/users", json={
        "name": "Ramesh Naidu", 
        "age": 34, 
        "gender": "male", 
        "annual_income": 180000, 
        "state": "Telangana", 
        "category": "obc", 
        "land_holding_acres": 2.5, 
        "occupation": "farmer"
    })
    print("User Create Response:", res.json())
    user_id = res.json()["id"]

    # Check eligibility
    res = requests.post(f"http://127.0.0.1:8000/eligibility/check/{user_id}")
    print("\nEligibility Check Results:")
    for result in res.json().get("results", []):
        print(f"Scheme: {result['scheme_name']}")
        print(f"Eligible: {result['is_eligible']}")
        print(f"Explanation: {result['ai_explanation']}")
        print("-")

if __name__ == "__main__":
    test()
