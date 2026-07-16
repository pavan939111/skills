# Interceptor Pattern Implementation

## 1. Definition & Core Concepts
The Interceptor Pattern (similar to Aspect-Oriented Programming) intercepts method calls, message flows, or RPC calls at system boundaries (e.g. gRPC calls, database operations, HTTP requests) to apply general behaviors (such as logging metrics or caching responses) dynamically.

## 2. Why It Exists
It wraps backend operations cleanly without altering class business logic. Interceptors monitor service execution, handle database transaction commits, and report latency.

## 3. What Breaks in Production Without It
- **Distributed Trace Gaps:** Failures to pass trace contexts across gRPC/HTTP boundaries break observability maps.
- **Inconsistent Logging:** Operations fail to print standard entry/exit markers during debugging.

## 4. Code Shape / Implementation Guidelines
- **gRPC Unary Interceptor Pattern (Python):**
  ```python
  def intercept_unary(self, method, request, context):
      correlation_id = context.invocation_metadata().get('x-correlation-id')
      # Inject trace context
      setup_trace_context(correlation_id)
      return method(request, context)
  ```

## 5. Verification & Testing Checklist
- [ ] Interceptor handles exceptions and converts them to standard API status errors.
- [ ] Trace context metadata is propagated successfully across RPC network links.
