# Healthcare System Design Template

## 1. Target Product Shape
Highly regulated Electronic Health Record (EHR) platform managing patient profiles, prescriptions, billing records, and audit logs.

## 2. Requirements Analysis
- **Functional:** Manage patient medical files, write prescriptions, log provider updates, process billing insurance claims.
- **Non-Functional:** HIPAA compliance, strict zero-trust access control, full audit trails of all reads and writes, high database availability.

## 3. Capacity Planning & Sizing Calculations
- **Traffic Targets:**
  - Active Patients: 500,000.
  - Frequency: Low write rates, high read rates during clinic hours.
- **Sizing Math:**
  - *Storage:* 500,000 patient charts $\times 10\text{ MB (scans + text)} \approx 5\text{ Terabytes}$ storage requirement.
  - *Compute:* Highly secure VPC servers (Active-Standby failover setup).

## 4. Selected Architecture & Components
- **Architecture Style:** Monolith with encrypted, isolated subnets.
- **Core Components:**
  - Audit Trail Engine (records every database read request).
  - Patient Files Module (manages encrypted charts).
  - Prescriptions Signer (handles cryptographic keys).

## 5. Technology Selection Strategy
- **Primary Database:** PostgreSQL with application-level column encryption for PII.
- **Asset Storage:** AWS S3 (with KMS encryption-at-rest for medical scans).
- **Audit Logs Store:** AWS CloudTrail / CloudWatch Logs configured with WORM (Write Once Read Many) retention.

## 6. Critical Trade-offs
- **Access Audit Overhead vs. Latency:** Records every patient file read in an immutable ledger (high write load), accepting minor database latency to meet HIPAA standards.
- **Envelope Encryption Complexity:** Encrypts clinical columns individually using patient keys, reducing database search speeds.

## 7. Reusable Design Checklist
```markdown
- [ ] Patient PII columns encrypted at the application level before database writes.
- [ ] Read audit logging database hooks record client IP and user ID for every health record request.
- [ ] File uploads scanned for malware and stored in private S3 buckets using AWS KMS keys.
```
