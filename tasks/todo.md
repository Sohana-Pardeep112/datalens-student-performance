## Task 1: Initialize Project Skeletons
**Description:** Set up the basic React/Vite frontend and FastAPI backend folder structure with their respective dependencies.
**Acceptance criteria:**
- [x] Vite frontend runs on port 5173 without errors.
- [x] FastAPI backend runs on port 8000 and returns a health check response.
**Verification:**
- [x] Manual check: Open `http://localhost:5173` and `http://localhost:8000/health`.
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
- [x] SQLite database file is generated.
- [x] Dataset metadata table (id, filename, created_at, table_name) can be created via SQLAlchemy.
**Verification:**
- [x] Tests pass: `pytest tests/test_db.py`
**Dependencies:** Task 1
**Files likely touched:**
- `backend/core/database.py`
- `backend/models/dataset.py`
**Estimated scope:** S

## Task 3: CSV Upload API
**Description:** Create a POST endpoint to upload a CSV, use Pandas to parse it, create a dynamic SQLite table, and save metadata.
**Acceptance criteria:**
- [x] POST `/upload` endpoint accepts a CSV file.
- [x] Backend creates a dynamic SQLite table and inserts full CSV rows.
**Verification:**
- [x] Tests pass: `pytest tests/test_upload.py`
**Dependencies:** Task 2
**Files likely touched:**
- `backend/api/upload.py`
- `backend/services/csv_parser.py`
**Estimated scope:** M

## Task 4: Data Profiling Backend
**Description:** Detect column types, count nulls, and compute basic stats immediately after CSV upload.
**Acceptance criteria:**
- [ ] Calculate min, max, mean for numeric columns.
- [ ] Calculate unique counts for categorical columns.
- [ ] Return JSON profile data from the upload endpoint.
**Verification:**
- [ ] Tests pass: `pytest tests/test_profiling.py`
**Dependencies:** Task 3
**Files likely touched:**
- `backend/services/profiling.py`
- `backend/api/upload.py`
**Estimated scope:** M

## Task 5: Frontend Upload Component
**Description:** Build a React component using Tailwind CSS to allow users to select and upload a CSV file.
**Acceptance criteria:**
- [ ] File input allows selecting `.csv` files.
- [ ] UI shows loading state during upload and captures the response.
**Verification:**
- [ ] Manual check: Upload `student-mat.csv` and verify it succeeds.
**Dependencies:** Task 3
**Files likely touched:**
- `frontend/src/components/Upload.tsx`
- `frontend/src/services/api.ts`
- `frontend/src/pages/Dashboard.tsx`
**Estimated scope:** M

## Task 6: Data Profiling Frontend
**Description:** Display the data profile returned from the backend after upload.
**Acceptance criteria:**
- [ ] Table or cards displaying column names, types, null counts, and stats.
**Verification:**
- [ ] Manual check: Upload CSV and see profiling data appear.
**Dependencies:** Task 4, Task 5
**Files likely touched:**
- `frontend/src/components/DataProfile.tsx`
- `frontend/src/pages/Dashboard.tsx`
**Estimated scope:** M

## Task 7: Executive Summary Backend
**Description:** Create a service to gather dataset statistics via Pandas and call Claude to generate an executive summary.
**Acceptance criteria:**
- [ ] Backend extracts basic stats and sends to Claude.
- [ ] Claude returns a business-analyst narrative summary.
**Verification:**
- [ ] Tests pass: `pytest tests/test_summary.py` (with mocked Anthropic API)
**Dependencies:** Task 4
**Files likely touched:**
- `backend/core/llm.py`
- `backend/services/summary.py`
- `backend/api/upload.py`
**Estimated scope:** M

## Task 8: Frontend Executive Summary View
**Description:** Render the executive summary returned by the backend after a successful CSV upload.
**Acceptance criteria:**
- [ ] Summary is displayed below the upload/profile components.
- [ ] Text is properly formatted (Markdown/paragraphs).
**Verification:**
- [ ] Manual check: Upload CSV and observe summary text.
**Dependencies:** Task 5, Task 7
**Files likely touched:**
- `frontend/src/components/Summary.tsx`
- `frontend/src/pages/Dashboard.tsx`
**Estimated scope:** S

## Task 9: LLM Tool Definitions
**Description:** Define Claude tools (e.g., `query_data(sql)`) to safely query the SQLite database.
**Acceptance criteria:**
- [ ] Tool schemas defined in JSON format for Anthropic API.
- [ ] Python execution functions for tools are implemented securely (read-only SQLite).
**Verification:**
- [ ] Tests pass: `pytest tests/test_tools.py`
**Dependencies:** Task 2, Task 7
**Files likely touched:**
- `backend/services/tools.py`
**Estimated scope:** M

## Task 10: Chat API Endpoint
**Description:** Create a POST endpoint that accepts a user message, runs the Claude chat loop, handles tool calls, and returns the final answer.
**Acceptance criteria:**
- [ ] POST `/chat` accepts `{ dataset_id, message }`.
- [ ] Handles Claude's tool use loop until a final text response is generated.
**Verification:**
- [ ] Tests pass: `pytest tests/test_chat.py`
**Dependencies:** Task 9
**Files likely touched:**
- `backend/api/chat.py`
- `backend/services/chat_loop.py`
**Estimated scope:** L

## Task 11: Frontend Chat Interface
**Description:** Build a chat UI where the user can type questions and see Claude's responses.
**Acceptance criteria:**
- [ ] Input box and submit button.
- [ ] Message bubbles for user and AI.
- [ ] Loading indicator while waiting for response.
**Verification:**
- [ ] Manual check: Send a message and see response appear.
**Dependencies:** Task 10
**Files likely touched:**
- `frontend/src/components/Chat.tsx`
- `frontend/src/types/chat.ts`
- `frontend/src/pages/Dashboard.tsx`
**Estimated scope:** M

## Task 12: Chart Tool Definition
**Description:** Define a `generate_chart` tool for Claude to output structured JSON configurations for Recharts.
**Acceptance criteria:**
- [ ] Tool defined for Claude specifying Recharts JSON schema (type, data, keys).
- [ ] Chat endpoint modified to return structured chart data alongside text.
**Verification:**
- [ ] Tests pass: `pytest tests/test_chart_tool.py`
**Dependencies:** Task 10
**Files likely touched:**
- `backend/services/tools.py`
- `backend/api/chat.py`
**Estimated scope:** M

## Task 13: Frontend Chart Rendering
**Description:** Implement a dynamic Recharts component that consumes the JSON returned by the LLM and renders the appropriate chart.
**Acceptance criteria:**
- [ ] Supports 4 to 6 basic chart types (e.g., Bar, Line, Pie, Scatter).
- [ ] Renders correctly when Claude includes a chart in the response.
**Verification:**
- [ ] Manual check: Ask Claude to "show a bar chart of failures by sex" and verify rendering.
**Dependencies:** Task 11, Task 12
**Files likely touched:**
- `frontend/src/components/ChartRenderer.tsx`
- `frontend/src/components/Chat.tsx`
**Estimated scope:** L

## Task 14: Global Filters
**Description:** Add controls that dynamically filter the underlying dataset for all charts on the dashboard.
**Acceptance criteria:**
- [ ] Render controls based on column types (dropdowns for categorical, sliders for numeric).
- [ ] Adjusting filters updates the context and re-renders charts to reflect filtered data.
**Verification:**
- [ ] Manual check: Move a slider or select a dropdown and confirm charts update.
**Dependencies:** Task 6, Task 13
**Files likely touched:**
- `frontend/src/components/GlobalFilters.tsx`
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/services/api.ts`
**Estimated scope:** L
