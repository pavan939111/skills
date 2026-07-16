# Health Checks

## 1. Backend Application Context
Health Checks expose endpoints (like /healthz, /live, /ready) that container orchestrators (Kubernetes) query to check service status.

## 2. Backend-Specific Pitfalls
- **Ready checks blocking on downstream failures:** Configuring readiness probes to fail when third-party APIs are offline, causing Kubernetes to terminate healthy containers. Check local database pools only.

## 3. Code-Shape Example
`python
# Readiness check validating Postgres connection pool availability
@app.get("/readyz")
def readiness_check():
    try:
        # Quick database connection ping
        db.ping()
        return {"status": "ready"}
    except DatabaseConnectionError:
        # Return 503 Service Unavailable to notify kubernetes
        return {"status": "unavailable"}, 503
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Observability](../observability-management-guide.md)
