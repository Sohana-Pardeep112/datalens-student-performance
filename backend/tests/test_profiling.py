from fastapi.testclient import TestClient
from main import app
from core.database import Base, engine
import io

client = TestClient(app)

def setup_module(module):
    Base.metadata.create_all(bind=engine)

def test_upload_and_profile():
    # 1. Upload a CSV
    csv_content = b"age;gender;score\n15;M;12.5\n16;F;14.0\n15;F;15.5\n;M;10.0"
    file = io.BytesIO(csv_content)
    file.name = "students.csv"
    
    upload_res = client.post(
        "/api/upload",
        files={"file": ("students.csv", file, "text/csv")}
    )
    assert upload_res.status_code == 200
    dataset_id = upload_res.json()["id"]
    
    # 2. Get profile
    prof_res = client.get(f"/api/datasets/{dataset_id}/profile")
    assert prof_res.status_code == 200
    profile = prof_res.json()
    
    assert profile["num_rows"] == 4
    assert profile["num_columns"] == 3
    
    # Check numeric column (age has a null)
    age_col = profile["columns"]["age"]
    assert age_col["type"] == "numeric"
    assert age_col["null_count"] == 1
    assert age_col["stats"]["min"] == 15.0
    assert age_col["stats"]["max"] == 16.0
    
    # Check categorical column
    gender_col = profile["columns"]["gender"]
    assert gender_col["type"] == "categorical"
    assert gender_col["null_count"] == 0
    assert gender_col["stats"]["unique_values"] == 2
    assert gender_col["stats"]["value_counts"]["F"] == 2
    assert gender_col["stats"]["value_counts"]["M"] == 2
