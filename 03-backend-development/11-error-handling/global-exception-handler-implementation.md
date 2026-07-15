# Global Exception Handler

## 1. Backend Application Context
The Global Exception Handler acts as a catch-all middleware in backend frameworks (Express error-handling middleware, NestJS Exception Filters, Spring @ControllerAdvice) that intercepts all unhandled errors, logs their details with correlation IDs, and maps them to clean HTTP response payloads.

## 2. Backend-Specific Pitfalls
- **Leaking stack traces:** Outputting raw system stack traces to clients in HTTP 500 errors, exposing database paths and credentials.
- **Silent crashes:** Forgetting to catch exceptions in asynchronous execution loops (e.g. unhandled promise rejections in Node), causing process termination.

## 3. Code-Shape Example
`python
# FastAPI custom exception handler middleware
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    correlation_id = request.headers.get("X-Correlation-ID", "unknown")
    logger.error(f"Unhandled error: {str(exc)} | ID: {correlation_id}", exc_info=True)
    
    # Map domain exceptions to HTTP status codes
    status_code = 500
    message = "Internal Server Error"
    
    if isinstance(exc, EntityNotFoundException):
        status_code = 404
        message = str(exc)
    elif isinstance(exc, BusinessRuleException):
        status_code = 400
        message = str(exc)
        
    return JSONResponse(
        status_code=status_code,
        content={"error": {"code": "SYSTEM_ERROR", "message": message, "correlation_id": correlation_id}}
    )
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Error Handling & Exception Strategy](../../production_principles/reliability-coding-practices/01-error-handling-exception-strategy-implementation.md)
