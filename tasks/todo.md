## Task 1: Initialize Project Skeletons
**Description:** Set up the basic React/Vite frontend and FastAPI backend folder structure with their respective dependencies.
**Acceptance criteria:**
- [ ] Vite frontend runs on port 5173 without errors.
- [ ] FastAPI backend runs on port 8000 and returns a health check response.
**Verification:**
- [ ] Manual check: Open `http://localhost:5173` and `http://localhost:8000/health`.
**Dependencies:** None
**Files likely touched:**
- `frontend/package.json`
- `frontend/vite.config.ts`
- `backend/requirements.txt`
- `backend/main.py`
**Estimated scope:** M

## Task 2: Database Setup & Models
**Description:** Configure SQLite database connection using SQLAlchemy and create models for storing dataset metadata.
**Acceptance criteria:**
- [ ] SQLite database file is generated.
- [ ] Dataset metadata table (id, filename, created_at, table_name) can be created via SQLAlchemy.
**Verification:**
- [ ] Tests pass: `pytest tests/test_db.py`
**Dependencies:** Task 1
**Files likely touched:**
- `backend/core/database.py`
- `backend/models/dataset.py`
**Estimated scope:** S

## Task 3: CSV Upload API
**Description:** Create a POST endpoint to upload a CSV, use Pandas to parse it, create a dynamic SQLite table, and save metadata.
**Acceptance criteria:**
- [ ] POST `/upload` endpoint accepts a CSV file.
- [ ] Backend creates a dynamic SQLite table and inserts full CSV rows.
**Verification:**
- [ ] Tests pass: `pytest tests/test_upload.py`
**Dependencies:** Task 2
**Files likely touched:**
- `backend/api/upload.py`
- `backend/services/csv_parser.py`
**Estimated scope:** M

## Task 4: Frontend Upload Component
**Description:** Build a React component using Tailwind CSS to allow users to select and upload a CSV file.
**Acceptance criteria:**
- [ ] File input allows selecting `.csv` files.
- [ ] UI shows loading state during upload and success message upon completion.
**Verification:**
- [ ] Manual check: Upload `student-mat.csv` and verify it succeeds.
**Dependencies:** Task 3
**Files likely touched:**
- `frontend/src/components/Upload.tsx`
- `frontend/src/services/api.ts`
- `frontend/src/pages/Dashboard.tsx`
**Estimated scope:** M

## Task 5: Executive Summary Backend
**Description:** Create a service to gather dataset statistics via Pandas and call Claude to generate an executive summary.
**Acceptance criteria:**
- [ ] Backend extracts basic stats (row count, columns, types) and sends to Claude.
- [ ] Claude returns a business-analyst narrative summary.
**Verification:**
- [ ] Tests pass: `pytest tests/test_summary.py` (with mocked Anthropic API)
**Dependencies:** Task 3
**Files likely touched:**
- `backend/core/llm.py`
- `backend/services/summary.py`
- `backend/api/upload.py` (update to call summary)
**Estimated scope:** M

## Task 6: Frontend Executive Summary View
**Description:** Render the executive summary returned by the backend after a successful CSV upload.
**Acceptance criteria:**
- [ ] Summary is displayed below the upload component.
- [ ] Text is properly formatted (Markdown/paragraphs).
**Verification:**
- [ ] Manual check: Upload CSV and observe summary text.
**Dependencies:** Task 4, Task 5
**Files likely touched:**
- `frontend/src/components/Summary.tsx`
- `frontend/src/pages/Dashboard.tsx`
**Estimated scope:** S

## Task 7: LLM Tool Definitions
**Description:** Define Claude tools (e.g., `query_data(sql)`) to safely query the SQLite database.
**Acceptance criteria:**
- [ ] Tool schemas defined in JSON format for Anthropic API.
- [ ] Python execution functions for tools are implemented securely (read-only SQLite).
**Verification:**
- [ ] Tests pass: `pytest tests/test_tools.py`
**Dependencies:** Task 2, Task 5
**Files likely touched:**
- `backend/services/tools.py`
**Estimated scope:** M

## Task 8: Chat API Endpoint
**Description:** Create a POST endpoint that accepts a user message, runs the Claude chat loop, handles tool calls, and returns the final answer.
**Acceptance criteria:**
- [ ] POST `/chat` accepts `{ dataset_id, message }`.
- [ ] Handles Claude's tool use loop until a final text response is generated.
**Verification:**
- [ ] Tests pass: `pytest tests/test_chat.py`
**Dependencies:** Task 7
**Files likely touched:**
- `backend/api/chat.py`
- `backend/services/chat_loop.py`
**Estimated scope:** L

## Task 9: Frontend Chat Interface
**Description:** Build a chat UI where the user can type questions and see Claude's responses.
**Acceptance criteria:**
- [ ] Input box and submit button.
- [ ] Message bubbles for user and AI.
- [ ] Loading indicator while waiting for response.
**Verification:**
- [ ] Manual check: Send a message and see response appear.
**Dependencies:** Task 8
**Files likely touched:**
- `frontend/src/components/Chat.tsx`
- `frontend/src/types/chat.ts`
- `frontend/src/pages/Dashboard.tsx`
**Estimated scope:** M

## Task 10: Chart Tool Definition
**Description:** Define a `generate_chart` tool for Claude to output structured JSON configurations for Recharts.
**Acceptance criteria:**
- [ ] Tool defined for Claude specifying Recharts JSON schema (type, data, keys).
- [ ] Chat endpoint modified to return structured chart data alongside text.
**Verification:**
- [ ] Tests pass: `pytest tests/test_chart_tool.py`
**Dependencies:** Task 8
**Files likely touched:**
- `backend/services/tools.py`
- `backend/api/chat.py`
**Estimated scope:** M

## Task 11: Frontend Chart Rendering
**Description:** Implement a dynamic Recharts component that consumes the JSON returned by the LLM and renders the appropriate chart.
**Acceptance criteria:**
- [ ] Supports 4 to 6 basic chart types (e.g., Bar, Line, Pie, Scatter).
- [ ] Renders correctly when Claude includes a chart in the response.
**Verification:**
- [ ] Manual check: Ask Claude to "show a bar chart of failures by sex" and verify rendering.
**Dependencies:** Task 9, Task 10
**Files likely touched:**
- `frontend/src/components/ChartRenderer.tsx`
- `frontend/src/components/Chat.tsx`
**Estimated scope:** L
