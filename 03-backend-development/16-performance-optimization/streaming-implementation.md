# Streaming

## 1. Backend Application Context
Streaming is the process of transmitting data (such as files, video streams, or large database outputs) in smaller, sequential chunks, avoiding loading entire payloads into server memory.

## 2. Backend-Specific Pitfalls
- **Memory buffering:** Unintentionally buffering the full stream payload before transmitting it to client responses.

## 3. Code-Shape Example
`python
# Streaming large database outputs via Server-Sent Events (SSE)
from fastapi.responses import StreamingResponse

async def event_generator():
    async for row in db.stream_large_query():
        yield f"data: {json.dumps(row)}\n\n"

@app.get("/stream-data")
def stream_data():
    return StreamingResponse(event_generator(), media_type="text/event-stream")
`

## 4. Read First
Before applying this backend application note, review the full deep-dives:
- [Performance Engineering](../../production_principles/performance-and-scale/01-performance-engineering.md)
