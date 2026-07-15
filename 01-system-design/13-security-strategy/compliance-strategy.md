# Compliance Strategy

### 1. The Question Decided
"Which regulatory compliance standards (GDPR, HIPAA, PCI-DSS) govern system security architecture, and how do we isolate compliant data environments?"

### 2. Options Compared
| Environment | Isolated Compliant Subnet (CDE) | Standard Integrated Cloud | Multi-Region Partitioned |
|---|---|---|---|
| **Cost** | High | Low | High |
| **Complexity** | High | Low | Very High |
| **Compliance Safety**| Extremely High (Limits audits scope) | Low (Full stack audited) | High |
| **Applicability** | PCI cardholder data | Non-regulated data | GDPR residency |

### 3. Decision Rule
- **Choose Isolated Subnets if:** Storing credit card data (PCI) or health records (HIPAA). Isolating this data minimizes the scope of regulatory audits.
- **Choose Multi-Region Partitioning if:** Compelled by GDPR residency laws to store and process European citizens PII within EU borders.

### 4. Red Flags to Revisit
- A standard database update triggers a full PCI security audit because credit card numbers were stored in standard tables without logical isolation.
- European customer records are synced to US replicas, violating EU data protection boundaries.

### 5. Where to Go Next
- For threat modeling, compliance audits, and access logging, see [Security Foundations](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/foundations/04-security.md).
- For compliance requirement scoping guidelines, see [Compliance Requirements Analysis](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/01-requirement-analysis/compliance-requirements-strategy-implementation.md).
