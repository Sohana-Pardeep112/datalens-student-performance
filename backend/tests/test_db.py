from core.database import Base, engine, SessionLocal
from models.dataset import Dataset
import os

def test_create_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Test DB session
    db = SessionLocal()
    
    # Add a mock dataset
    test_dataset = Dataset(filename="test.csv", table_name="test_data_table")
    db.add(test_dataset)
    db.commit()
    
    # Retrieve it
    db.refresh(test_dataset)
    assert test_dataset.id is not None
    assert test_dataset.filename == "test.csv"
    assert test_dataset.table_name == "test_data_table"
    
    # Clean up
    db.delete(test_dataset)
    db.commit()
    db.close()
