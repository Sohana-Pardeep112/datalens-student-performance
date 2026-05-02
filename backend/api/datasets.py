from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.services.profiling import generate_profile

router = APIRouter()

@router.get("/datasets/{dataset_id}/profile")
def get_dataset_profile(dataset_id: int, db: Session = Depends(get_db)):
    try:
        profile = generate_profile(dataset_id, db)
        return profile
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
