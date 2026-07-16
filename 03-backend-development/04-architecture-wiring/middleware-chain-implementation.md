# Middleware Chain Implementation

## 1. Definition & Core Concepts
A Middleware Chain (or Pipeline) is a design pattern that executes a sequential chain of HTTP handlers, intercepting requests and responses. Each middleware performs a specific cross-cutting function (e.g. logging, auth, parsing) before passing execution to the next handler in the pipeline.

## 2. Why It Exists
It isolates request preprocessing logic from core business services. Keeping auth and validation inside HTTP controller routes creates duplicate code, whereas middleware chains centralize cross-cutting tasks.

## 3. What Breaks in Production Without It
- **Code Duplication:** Auth and error routing checks scatter across thousands of controller route handlers.
- **Leaked Exceptions:** Uncaught exceptions inside routes bypass global catch logs, crashing workers or exposing raw stack traces.

## 4. Code Shape / Implementation Guidelines
- **Go Handler Middleware Pattern:**
  ```go
  func AuthMiddleware(next http.Handler) http.Handler {
      return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
          token := r.Header.Get("Authorization")
          if token == "" {
              http.Error(w, "Unauthorized", http.StatusUnauthorized)
              return
          }
          next.ServeHTTP(w, r)
      })
  }
  ```

## 5. Verification & Testing Checklist
- [ ] Handler executes auth checks before delegating to downstream controller.
- [ ] Correlation ID is generated and injected into request context at the first link.
