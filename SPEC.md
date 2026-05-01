# Spec: DataLens

## Objective
DataLens is a generic CSV analytics web application. It enables users to upload any CSV file and interactively analyze it using natural language, powered by Anthropic Claude. The application simplifies data exploration by automatically generating insights, an executive summary, visualizations using Recharts, and data queries based on the uploaded datasets. The LLM interacts with the data via strict tool calling.

## Primary Development Dataset
The primary dataset used for development contains student performance data:
- **Size:** 649 rows, 33 columns
- **Format:** Semicolon-delimited CSV
- **Subject:** Portuguese secondary school students
- **Key Columns:** `school`, `sex`, `age`, `G1`, `G2`, `G3` (grades from 0 to 20), `studytime`, `failures`, `internet`, `absences`, `Medu`, and `Fedu`.
- **Target Variable:** `G3` (final grade).
- **Data Types:** Many columns are represented as "yes" or "no" strings.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, TypeScript, Recharts (for visualizations)
- **Backend:** Python, FastAPI, Pandas, SQLite
- **LLM Integration:** Anthropic Claude API (utilizing Tool Calling)

## Commands
### Frontend (in `frontend/` directory)
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

### Backend (in `backend/` directory)
- Install: `pip install -r requirements.txt`
- Dev: `uvicorn main:app --reload`
- Test: `pytest`
- Format: `black .`

## Project Structure
```text
datalens/
├── frontend/           → React + Vite SPA
│   ├── src/
│   │   ├── components/ → Reusable UI components (Tailwind, Recharts)
│   │   ├── pages/      → Top-level page components
│   │   ├── services/   → API client functions
│   │   └── types/      → TypeScript interfaces
├── backend/            → FastAPI backend
│   ├── api/            → API routers and endpoints
│   ├── core/           → Config, LLM setup
│   ├── models/         → SQLite database models (full CSV persistence)
│   ├── services/       → Pandas data processing & Claude tool definitions
│   └── tests/          → Backend tests
├── SPEC.md             → This specification
```

## Code Style
### Frontend (React/TypeScript)
```typescript
import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button 
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      onClick={onClick}
    >
      {label}
    </button>
  );
};
```
- Use functional components and hooks.
- Use Tailwind classes for all styling.
- Strictly type props and state.

### Backend (Python/FastAPI)
```python
from fastapi import APIRouter, UploadFile, File
import pandas as pd

router = APIRouter()

@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    # Logic to load CSV fully into SQLite tables
    pass
```
- Use Python type hints universally.
- Format code with `black`.
- Keep route handlers thin; delegate business logic to `services/`.

## Testing Strategy
- **Backend:** Uses pytest for API endpoint tests and data processing functions. Minimum one test per API endpoint.
- **Frontend:** Uses Vitest for component tests.

## Out of Scope
- No user authentication
- No mobile responsive design
- No machine learning models
- No real-time collaboration
- No paid third-party services beyond the LLM API
- Local laptop deployment only

## Boundaries
- **Always:** Use SQLite to persist the full CSV data, not just metadata, so datasets survive page refreshes. Use Claude's Tool Calling functionality (e.g., `query_data`, `get_statistics`, `generate_chart`) rather than relying on raw code generation or unconstrained prompts.
- **Ask first:** Before adding new visualization libraries other than Recharts. Before making irreversible schema migrations to the uploaded data tables.
- **Never:** Never send sensitive raw PII data from the CSV to the Anthropic API without anonymization. Never rely on in-memory storage for datasets across sessions.

## Success Criteria
- User can upload the primary development dataset (semicolon-delimited) and the application correctly parses it and stores the full data in SQLite tables.
- Datasets and chat sessions persist across page refreshes.
- The application generates an **Executive Summary** upon dataset upload, providing a business-analyst-style narrative of key patterns in the data using the LLM.
- The user can ask questions in a chat interface, and the LLM answers by calling specific tools (e.g., `query_data`, `get_statistics`, `generate_chart`).
- The application dynamically renders 4 to 6 different visualizations using **Recharts** based on the user's questions or the executive summary.
- The UI is responsive, looks modern (Tailwind), and gracefully handles loading states during LLM processing and database queries.

## Open Questions
1. How should we handle multiple users? Is there a need for authentication, or is this a single-tenant local application?
2. When creating SQLite tables from uploaded CSVs, do we dynamically generate the schema based on pandas datatypes, or do we store it generically?
3. What specific 4-6 chart types do we prioritize in Recharts (e.g., bar, line, scatter, pie)?
