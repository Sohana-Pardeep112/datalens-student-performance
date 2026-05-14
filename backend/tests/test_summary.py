import io
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from main import app
from core.database import Base, engine

client = TestClient(app)

def setup_module(module):
    Base.metadata.create_all(bind=engine)

@patch('services.summary.Groq')
def test_get_dataset_summary(mock_groq):
    # Mock Groq Client
    mock_client_instance = MagicMock()
    mock_groq.return_value = mock_client_instance
    
    mock_choice = MagicMock()
    mock_choice.message.content = "This is a mock executive summary."
    mock_response = MagicMock()
    mock_response.choices = [mock_choice]
    
    mock_client_instance.chat.completions.create.return_value = mock_response

    # 1. Upload a CSV
    csv_content = b"col1;col2\nval1;val2\nval3;val4"
    file = io.BytesIO(csv_content)
    file.name = "summary_test.csv"
    
    upload_res = client.post(
        "/api/upload",
        files={"file": ("summary_test.csv", file, "text/csv")}
    )
    dataset_id = upload_res.json()["id"]
    
    # 2. Get summary
    res = client.get(f"/api/datasets/{dataset_id}/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["summary"] == "This is a mock executive summary."
    
    # Verify Groq was called correctly
    mock_client_instance.chat.completions.create.assert_called_once()
    call_kwargs = mock_client_instance.chat.completions.create.call_args.kwargs
    assert call_kwargs["model"] == "llama-3.3-70b-versatile"
    assert "You are an expert business analyst" in call_kwargs["messages"][0]["content"]
