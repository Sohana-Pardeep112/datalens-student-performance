import pandas as pd
from sqlalchemy.orm import Session
from backend.models.dataset import Dataset
from backend.core.database import engine
import uuid
from typing import BinaryIO

def process_and_store_csv(file: BinaryIO, filename: str, db: Session) -> Dataset:
    # 1. Parse CSV with Pandas (using semicolon delimiter as specified)
    try:
        # We'll try semicolon first, if it parses as 1 column we could fallback,
        # but for now we'll stick to sep=';' per requirements.
        df = pd.read_csv(file, sep=';')
    except Exception as e:
        raise ValueError(f"Failed to parse CSV: {str(e)}")

    # 2. Generate unique table name
    table_name = f"data_{uuid.uuid4().hex}"

    # 3. Create dynamic SQLite table and insert rows
    df.to_sql(table_name, engine, if_exists="replace", index=False)

    # 4. Save metadata
    dataset = Dataset(filename=filename, table_name=table_name)
    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    return dataset
