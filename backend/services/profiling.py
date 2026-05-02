import pandas as pd
from sqlalchemy.orm import Session
from backend.models.dataset import Dataset
from backend.core.database import engine

def generate_profile(dataset_id: int, db: Session):
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise ValueError("Dataset not found")
        
    df = pd.read_sql_table(dataset.table_name, engine)
    
    profile = {
        "num_rows": len(df),
        "num_columns": len(df.columns),
        "columns": {}
    }
    
    for col in df.columns:
        null_count = int(df[col].isnull().sum())
        
        col_profile = {
            "type": "",
            "null_count": null_count,
            "stats": {}
        }
        
        if pd.api.types.is_numeric_dtype(df[col]):
            col_profile["type"] = "numeric"
            col_profile["stats"] = {
                "min": float(df[col].min()) if not pd.isna(df[col].min()) else None,
                "max": float(df[col].max()) if not pd.isna(df[col].max()) else None,
                "mean": float(df[col].mean()) if not pd.isna(df[col].mean()) else None,
                "median": float(df[col].median()) if not pd.isna(df[col].median()) else None,
            }
        else:
            col_profile["type"] = "categorical"
            # Get counts of unique values, ignoring NaNs
            unique_counts = df[col].value_counts(dropna=True).to_dict()
            col_profile["stats"] = {
                "unique_values": len(unique_counts),
                "value_counts": unique_counts
            }
            
        profile["columns"][col] = col_profile
        
    return profile
