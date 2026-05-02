from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from services.csv_parser import process_and_store_csv

router = APIRouter()

@router.post("/upload")
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    try:
        dataset = process_and_store_csv(file.file, file.filename, db)
        return {
            "id": dataset.id, 
            "filename": dataset.filename, 
            "table_name": dataset.table_name, 
            "message": "Upload successful"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
