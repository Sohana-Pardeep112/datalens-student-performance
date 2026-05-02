from fastapi import FastAPI
from backend.api import upload

app = FastAPI(title="DataLens API")

app.include_router(upload.router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "DataLens backend is running"}
