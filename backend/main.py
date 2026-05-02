from fastapi import FastAPI
from backend.api import upload, datasets

app = FastAPI(title="DataLens API")

app.include_router(upload.router, prefix="/api")
app.include_router(datasets.router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "DataLens backend is running"}
