import io
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from main import app
from core.database import Base, engine

client = TestClient(app)

def setup_module(module):
    Base.metadata.create_all(bind=engine)

@patch('services.summary.Anthropic')
def test_get_dataset_summary(mock_anthropic):
    # Mock Anthropic Client
    mock_client_instance = MagicMock()
    mock_anthropic.return_value = mock_client_instance
    
    mock_message = MagicMock()
    mock_message.content = [MagicMock(text="This is a mock executive summary.")]
    mock_client_instance.messages.create.return_value = mock_message

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
    
    # Verify Anthropic was called correctly
    mock_client_instance.messages.create.assert_called_once()
    call_kwargs = mock_client_instance.messages.create.call_args.kwargs
    assert call_kwargs["model"] == "claude-3-haiku-20240307"
    assert "You are an expert business analyst" in call_kwargs["messages"][0]["content"]
