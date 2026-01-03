# app.py - FastAPI service providing /api/nodes endpoint
import asyncio
from fastapi import FastAPI

app = FastAPI()

@app.get("/api/nodes")
async def get_nodes():
    # Simulate network latency
    await asyncio.sleep(1)
    return [
        {"id": "1", "name": "Data Source"},
        {"id": "2", "name": "Transformer"},
        {"id": "3", "name": "Model"},
        {"id": "4", "name": "Sink"}
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
