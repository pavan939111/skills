# Distributed Logging

## 1. Backend Application Context
Distributed Logging aggregates logs from auto-scaled servers and microservices into a centralized logging platform (Elasticsearch, Logstash, Loki) using log shippers.

## 2. Backend-Specific Pitfalls
- **Using blocking logging configurations:** Let logging tasks execute synchronously, delaying API responses when central logging networks are congested.

## 3. Code-Shape Example
`
Microservice Pods (stdout/JSON logs)
          â†“ (Shipped asynchronously)
   Fluentbit / Vector (Log Agent)
          â†“ (Buffered writes)
Central ELK / Grafana Loki Cluster
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Logging](logging-checklist.md)
