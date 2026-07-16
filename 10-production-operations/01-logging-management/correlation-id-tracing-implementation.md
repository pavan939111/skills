# Correlation ID

## 1. Backend Application Context
A Correlation ID is a unique string generated at request entry (middleware) and passed down code loops and network calls, linking logs across services to trace single transactions.

## 2. Backend-Specific Pitfalls
- **Failing to forward correlation IDs:** Neglecting to pass correlation IDs in downstream gRPC or REST calls, breaking distributed traces.

## 3. Code-Shape Example
`python
# Middleware injecting and propagating Correlation ID
@app.middleware("http")
async def correlation_id_middleware(request: Request, call_next):
    correlation_id = request.headers.get("X-Correlation-ID") or generate_uuid()
    # Save in thread-local storage or request context
    context.set("correlation_id", correlation_id)
    
    response = await call_next(request)
    # Return to client for debugging
    response.headers["X-Correlation-ID"] = correlation_id
    return response
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Logging](logging-checklist.md)
