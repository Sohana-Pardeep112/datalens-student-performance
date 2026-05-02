from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from services.profiling import generate_profile
from services.summary import generate_executive_summary

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

@router.get("/datasets/{dataset_id}/summary")
def get_dataset_summary(dataset_id: int, db: Session = Depends(get_db)):
    try:
        summary = generate_executive_summary(dataset_id, db)
        return {"summary": summary}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
