from fastapi.testclient import TestClient
from main import app
from core.database import Base, engine, SessionLocal
from models.dataset import Dataset
import io

client = TestClient(app)

def setup_module(module):
    Base.metadata.create_all(bind=engine)

def test_upload_csv():
    # Create a dummy CSV with semicolons
    csv_content = b"col1;col2\nval1;val2\nval3;val4"
    file = io.BytesIO(csv_content)
    file.name = "test.csv"
    
    response = client.post(
        "/api/upload",
        files={"file": ("test.csv", file, "text/csv")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == "test.csv"
    assert "table_name" in data
    assert data["message"] == "Upload successful"
    
    # Check if dataset metadata was saved
    db = SessionLocal()
    dataset = db.query(Dataset).filter(Dataset.id == data["id"]).first()
    assert dataset is not None
    assert dataset.table_name == data["table_name"]
    db.close()
