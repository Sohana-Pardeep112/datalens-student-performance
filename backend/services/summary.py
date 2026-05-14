import os
import json
from dotenv import load_dotenv
from groq import Groq
from sqlalchemy.orm import Session
from services.profiling import generate_profile

load_dotenv()

def generate_executive_summary(dataset_id: int, db: Session) -> str:
    # 1. Get stats
    profile = generate_profile(dataset_id, db)
    
    # 2. Format as a readable string for the prompt
    stats_json = json.dumps(profile, indent=2)
    
    # 3. Call Groq
    # The Groq client automatically picks up GROQ_API_KEY from the environment
    client = Groq() 
    
    prompt = f"""
You are an expert business analyst and data scientist.
I have a dataset with the following statistical profile:
{stats_json}

Please provide a concise, high-level executive summary of this dataset.
Highlight key characteristics, missing data issues, and interesting distributions or top values.
Do not use more than 3 paragraphs. Output strictly the summary narrative.
"""
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=500
    )
    
    return response.choices[0].message.content
