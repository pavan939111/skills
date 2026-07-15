# Error Codes

## 1. Backend Application Context
Error Codes map internal system errors to machine-readable string constants (e.g. USER_NOT_FOUND, PAYMENT_DECLINED) that are returned in HTTP payloads, helping frontend clients parse and handle errors programmatically.

## 2. Backend-Specific Pitfalls
- **Relying solely on HTTP codes:** Returning only HTTP 400 for multiple distinct validation issues, forcing frontend clients to parse error strings.

## 3. Code-Shape Example
`json
// Standardized API error response payload
{
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "The account balance is insufficient for this transaction.",
    "correlation_id": "req-9a3dd284-19ca-44ed",
    "details": [
      {
        "field": "amount",
        "issue": "Requested 500 but only 120 is available"
      }
    ]
  }
}
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Error Handling & Exception Strategy](../../production_principles/reliability-coding-practices/01-error-handling-exception-strategy-implementation.md)
