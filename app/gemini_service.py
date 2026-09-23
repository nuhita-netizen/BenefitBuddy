import os
import google.generativeai as genai
from typing import Tuple
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-1.5-pro-latest') 
else:
    model = None

def generate_explanation(user_name: str, scheme_name: str, is_eligible: bool, reason: str) -> str:
    """
    Generates a plain-language explanation of the eligibility verdict.
    Falls back to a template if Gemini is unavailable.
    """
    if not model:
        # Fallback to template sentence
        if is_eligible:
            return f"{user_name} is eligible for {scheme_name}. {reason}"
        else:
            return f"Unfortunately, {user_name} is not eligible for {scheme_name} because: {reason}"
            
    prompt = f"""
    You are an AI assistant for a government benefits platform. 
    Explain to the user '{user_name}' whether they are eligible for the scheme '{scheme_name}'.
    
    Verdict: {'Eligible' if is_eligible else 'Not Eligible'}
    Technical Reason: {reason}
    
    Write a short, polite, and easy-to-understand explanation (1-2 sentences). 
    Do not change the verdict, only explain the technical reason in plain language.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        # Fallback in case of API error
        if is_eligible:
            return f"{user_name} is eligible for {scheme_name}. {reason}"
        else:
            return f"Unfortunately, {user_name} is not eligible for {scheme_name} because: {reason}"
