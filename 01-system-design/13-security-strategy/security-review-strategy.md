# Security Review Strategy

### 1. The Question Decided
"How are system design security strategies validated, and what code analysis or configuration checks confirm system compliance before release?"

### 2. Options Compared
| Audit Step | Static Analysis (SAST) | Dynamic Testing (DAST) | Architecture Design Review |
|---|---|---|---|
| **Cost** | Low | Medium | Low |
| **Primary Target** | Vulnerabilities in code | API runtime behaviors | Boundary design validation |
| **Complexity** | Low | High | Medium |
| **Timing** | Continuous (CI/CD) | Prior to release | Design phase |

### 3. Decision Rule
- **Standardize on a multi-stage review:**
  - *If* in the design phase, *then* execute **Architecture Design Reviews** (verify subnets, threat boundaries).
  - *If* in the coding phase, *then* enforce automated **SAST/Vulnerability Scans** on PR branches.
  - *If* in the pre-release phase, *then* run data-layer and API audits.

### 4. Red Flags to Revisit
- Security reviews are skipped to meet deadlines, leading to post-deploy database injection vulnerabilities.
- Code leaks secret keys in production logs due to un-audited logging routes.

### 5. Where to Go Next
- For the comprehensive data-layer security checklist, see [Database Security Review](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/12-production-checklists/security-review-strategy-implementation.md).
- For coding security practices and environment parameters audits, see [Security Foundations](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/foundations/04-security.md).
