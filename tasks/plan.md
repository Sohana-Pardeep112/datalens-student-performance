# Implementation Plan: DataLens

## Overview
DataLens is a generic CSV analytics web app built with React (Vite, Tailwind, TypeScript), FastAPI, Pandas, and SQLite. The LLM (Anthropic Claude) will power natural language data querying via tool calling and generate an executive summary upon data upload.

## Architecture Decisions
- **Database Slicing:** Each uploaded CSV will be dynamically loaded into its own SQLite table. A metadata table will track uploaded datasets.
- **Tool Calling:** Claude will be strictly provided with tools like `query_data(sql)` and `get_statistics(column)` to interact with the data, ensuring safe execution.
- **Visualizations:** The backend LLM will generate structured JSON describing the chart type and data series. The frontend will consume this JSON and map it directly to Recharts components.
- **Vertical Slicing:** Development will proceed in vertical slices: Foundation, CSV Pipeline, LLM Integration, and UI Polish.

## Task List

### Phase 1: Foundation (Backend & Frontend Skeleton)
- [ ] Task 1: Initialize Project Skeletons
- [ ] Task 2: Database Setup & Models

### Checkpoint: Foundation
- [ ] Both dev servers run (Vite and Uvicorn).
- [ ] SQLite database is created successfully.
- [ ] Basic tests pass.

### Phase 2: Core Data Pipeline
- [ ] Task 3: CSV Upload API
- [ ] Task 4: Data Profiling Backend
- [ ] Task 5: Frontend Upload Component
- [ ] Task 6: Data Profiling Frontend
- [ ] Task 7: Executive Summary Backend
- [ ] Task 8: Frontend Executive Summary View

### Checkpoint: Core Data Pipeline
- [ ] User can upload the primary development dataset.
- [ ] Full CSV data is persisted in SQLite.
- [ ] Data profile (stats, types, nulls) is generated and displayed.
- [ ] Executive summary is generated and displayed on the UI.

### Phase 3: Chat & Tool Calling
- [ ] Task 9: LLM Tool Definitions
- [ ] Task 10: Chat API Endpoint
- [ ] Task 11: Frontend Chat Interface

### Checkpoint: Chat & Tool Calling
- [ ] User can ask questions about the uploaded data.
- [ ] LLM successfully calls tools and returns natural language answers.

### Phase 4: Visualizations & Polish
- [ ] Task 12: Chart Tool Definition
- [ ] Task 13: Frontend Chart Rendering
- [ ] Task 14: Global Filters

### Checkpoint: Complete
- [ ] All acceptance criteria met.
- [ ] 4-6 Recharts visualizations are successfully generated dynamically.
- [ ] Dashboard contains global filters that adjust charts dynamically.
- [ ] Ready for review.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Dynamic SQLite Schema | High | Use Pandas `to_sql` for safe, dynamic table creation based on inferred types. |
| LLM Hallucinating SQL | High | Restrict LLM tool to read-only queries. Catch exceptions and return them to the LLM so it can correct its query. |
| Context Window Limits | Med | Only send table schema and statistics to the LLM system prompt, never the raw rows. |

## Open Questions
- None at this time.
