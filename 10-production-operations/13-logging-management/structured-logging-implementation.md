# Structured Logging

## 1. Backend Application Context
Structured Logging is the practice of outputting logs as parseable JSON objects containing metadata (timestamp, log level, service name, correlation ID) rather than unstructured text, allowing search systems to filter logs efficiently.

## 2. Backend-Specific Pitfalls
- **Writing logs to local files inside containers:** Storing log files inside ephemeral container environments instead of piping logs to stdout/stderr.

## 3. Code-Shape Example
`python
import json
import logging
import sys

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_entry = {
            "timestamp": self.formatTime(record),
            "level": record.levelname,
            "message": record.getMessage(),
            "service": "order-service",
            "correlation_id": getattr(record, "correlation_id", "unknown")
        }
        return json.dumps(log_entry)

# Redirect to stdout for container capture
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(JSONFormatter())
logger = logging.getLogger("service")
logger.addHandler(handler)
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Logging](../../production_principles/foundations/02-logging-management-guide.md)
