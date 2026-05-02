import os
import json
from anthropic import Anthropic
from sqlalchemy.orm import Session
from services.profiling import generate_profile

def generate_executive_summary(dataset_id: int, db: Session) -> str:
    # 1. Get stats
    profile = generate_profile(dataset_id, db)
    
    # 2. Format as a readable string for the prompt
    stats_json = json.dumps(profile, indent=2)
    
    # 3. Call Claude
    # The Anthropic client automatically picks up ANTHROPIC_API_KEY from the environment
    client = Anthropic() 
    
    prompt = f"""
You are an expert business analyst and data scientist.
I have a dataset with the following statistical profile:
{stats_json}

Please provide a concise, high-level executive summary of this dataset.
Highlight key characteristics, missing data issues, and interesting distributions or top values.
Do not use more than 3 paragraphs. Output strictly the summary narrative.
"""
    
    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=500,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    
    return response.content[0].text
