from fastapi import FastAPI

app = FastAPI(title="DataLens API")

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "DataLens backend is running"}
