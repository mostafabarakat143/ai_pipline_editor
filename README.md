 # AI Pipeline Editor

##  Features
- Visual pipeline canvas (drag, drop, connect nodes)
- Node palette (Data Source, Transformer, Model, Sink)
- Pipeline execution simulation with logs
- Backend mock API (FastAPI)
- Fully Dockerized frontend (and backend)
- Minimal setup using Docker or local tooling



##  Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Zustand (state management)
- React Flow / XYFlow (graph editor)
- Tailwind CSS

### Backend
- FastAPI (Python 3.10)

### Infrastructure
- Docker
- Docker Compose
- Nginx (serving production frontend build)

 

## Prerequisites
- **Docker Desktop** (Windows / macOS / Linux)
- (Optional for local development)  Node.js v20+  and npm 
- (Optional for backend local run)  Python 3.10+ 

 

### Full Stack (Frontend + Backend)
```bash
docker compose up --build

Then open:

Frontend: http://localhost:3000

Backend API Docs (Swagger): http://localhost:8000/docs

Frontend Only (Production Image)
    docker build -t ai-pipeline-editor-frontend .
    docker run -p 3000:80 ai-pipeline-editor-frontend
Open: http://localhost:3000

Frontend locally
npm install
npm run dev
Open: http://localhost:5173



## Architecture & State Management

### High-Level Architecture
- Frontend** renders the visual AI pipeline editor (canvas, node palette, configuration panels, execution logs).
- Backend** provides node metadata and example endpoints to simulate pipeline execution.
- Nginx** serves the production frontend build inside Docker.

### Data Flow
- Frontend fetches available node types from the backend (with a mock fallback).
- Users visually compose pipelines by adding and connecting nodes.
- The pipeline graph is stored in a centralized state store.
- Execution simulates pipeline processing and displays logs/results in the UI.

### State Management (Zustand)
Zustand manages:
- Nodes (type, position, configuration)
- Edges (connections)
- UI state (selection, validation)
- Execution state (running status, logs, results)

**Why Zustand?**
- Lightweight with minimal boilerplate
- Integrates naturally with React Flow graph state
- Predictable and easy to reason about for complex UI interactions

 

## Design Write-Up  

The goal was to build a clear and extensible  AI pipeline editor  that enables users to visually compose and execute processing steps.  
The design prioritizes modularity, predictable state management, and easy evaluation via Docker.

React Flow was used to handle the node-based UI efficiently, while Zustand provides a simple and scalable state layer.  
Pipeline execution is implemented as a simulation to demonstrate correct execution order and data flow without introducing unnecessary backend complexity.

 
