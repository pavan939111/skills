# Restore Testing

## 1. Definition & Core Concepts

Restore Testing is the automated practice of regularly deploying database backup files to isolated sandbox environments, executing full recovery procedures, and running verification scripts to guarantee backup integrity and system restorability.

Core concepts:
- **Continuous Restore Pipeline:** An automated background process (CI/CD or scheduled worker) that retrieves the latest backup, boots a clean database instance, and restores the data.
- **Verification Checks:** SQL scripts run post-restore to verify table schemas, row counts, constraints, and data page checksums, ensuring the restored database is valid.
- **Restore Sandbox:** An isolated, non-production VPC environment where restore pipelines execute without touching production networks or databases.
- **Data Sanitization (Masking):** Redacting or anonymizing sensitive PII in restored databases if the sandbox is used for staging or development.
- **Dry-run Drills:** Scheduled simulator outages where engineering teams practice manual database restores to verify runbooks.

*(Boundary Note: Code-level sandbox provisioning scripts (Terraform/Ansible), application-tier UI test runs, and corporate training schedules belong in operations and backend-development. This document covers database-level restore verification SQL, backup corruption checks, page checksums validation, and test sandbox boundaries.)*

## 2. Why It Exists / What Problem It Solves

An untested backup is not a backup. Many organizations write database backup files daily but never attempt to restore them. During a production outage, they discover that the backup files are empty, corrupted, encrypted with lost KMS keys, or take 48 hours to download, turning a solvable incident into a business-ending disaster. Restore testing validates backups and recovery times *before* an actual emergency.

## 3. What Breaks in Production Without It

- **Catastrophic Outages from Corrupted Backups:** A primary database crashes. The DBA downloads the backup files, only to find they are unreadable due to compression errors or disk corruption during write, leading to permanent data loss.
- **KMS Decryption Failures:** The database encryption keys (KEK) are rotated or deleted. The backups are still generated but are encrypted with the missing keys. The restore fails because the database cannot decrypt the backup block pages.
- **Out-of-Date Restore Runbooks:** An emergency occurs. The team attempts a manual restore but the engine version has changed, and the old restoration commands throw syntax errors, delaying recovery for hours.
- **Sandbox PII Data Leaks:** Restoring production backups containing plain-text user details to a staging environment for testing without executing sanitization scripts, exposing sensitive user data to QA testers.

## 4. Best Practices

- **Automate Restore Testing Daily:** Build an automated pipeline that runs daily:
  1. Spin up an isolated, temporary database instance.
  2. Download the latest physical base backup and transaction logs (WAL).
  3. Decrypt and restore the database to a target timestamp.
  4. Run validation queries and shut down the test instance.
- **Run Data Integrity Checks:** After the restore, execute native database checksum checks (e.g. `pg_checksums` or `ANALYZE`) to verify database blocks are free of corruption.
- **Track Restore Duration Metrics:** Measure and alert on restore times. If download and restoration times exceed the Recovery Time Objective (RTO), redesign the backup partitioning strategy.
- **Mask PII during Sandbox Restores:** If restored test databases are kept active for staging use, immediately execute database-level anonymization scripts to wipe or mask user passwords, credit cards, and addresses.
- **Verify Key Access Paths:** Ensure the restore test environment retrieves decryption keys from the KMS using isolated IAM policies, validating that keys are accessible during multi-region disaster recovery events.

## 5. Common Mistakes / Anti-Patterns

- **Trusting "Backup Succeeded" Alerts:** Assuming that because the backup script exited with a code 0, the backup is valid.
- **Manual Restore Testing Only:** Relying on DBAs to test restores manually "when they have time," resulting in tests rarely being executed.
- **Testing on Live Environments:** Attempting to run restore tests on active staging servers, risking database overwrites or resource exhaustion.
- **Ignoring Version Drift:** Failing to test restoring backups created in older database engine versions on newer database servers.

## 6. Security Considerations

- **Sandbox Network Isolation:** Ensure the sandbox database instance has zero network routes to production services, preventing test scripts from accidentally connecting to production endpoints and executing writes.

## 7. Performance Considerations

- **Compute and Storage Cost:** Restoring large databases daily consumes significant cloud compute and storage resources. Use lightweight, ephemeral instances (such as spot instances) that boot, run validation checks, and terminate immediately to control costs.

## 8. Scalability Considerations

- **Massive Database Restore Strategies:** For multi-terabyte databases, full daily restores are expensive. Optimize by restoring random samples of table data, or using storage snapshot clones that mount instantly for testing.

## 9. How Major Companies Implement It

- **Stripe:** Runs an automated database restoration pipeline that boots clean PostgreSQL database clusters from production backups daily, verifying that the entire ledger can be recovered within defined RTO windows.
- **Netflix:** Simulates regional data center losses by executing automated database restores on standby environments, verifying that backup systems can rebuild global data stores.

## 10. Decision Checklist (Restore Testing Framework)

Define restore testing frequency and scope:

- Use **Automated Daily Sandbox Restores** when:
  - Data correctness is critical (billing, identity systems).
  - System size is small-to-medium (<1TB, keeping costs low).
  - RTO is short (<4 hours).
- Use **Automated Weekly/Partitioned Restores** when:
  - Database size is massive (>2TB), making daily restores cost-prohibitive.
  - Test restores target a rolling subset of database partitions.
- Run **Manual Disaster Recovery Drills** when:
  - Simulating entire team responses to regional outages (execute quarterly).

## 11. AI Coding-Agent Implementation Guidelines

- Never write database backup scripts without including a corresponding automated restore test template.
- Always include database validation queries (e.g. checksum checks) in restore verification scripts.
- Always recommend running restore testing on isolated, ephemeral staging environments.
- Never write restore scripts that hardcode KMS keys — retrieve them dynamically from KMS endpoints.
- Always include PII masking SQL scripts in templates designed to copy production data to staging.

## 12. Reusable Checklist

- [ ] Automated daily restore testing pipeline active in isolated sandbox environments
- [ ] Decryption and KMS key access validated during the restore test process
- [ ] Database block page checksums verified post-restore (no disk corruption)
- [ ] Validation queries run to check schema structure and record counts
- [ ] Restore duration measured and alerts set if recovery exceeds RTO limits
- [ ] PII masking/anonymization scripts run on the restored test database
- [ ] Sandbox instance network completely isolated from production systems
- [ ] Disaster recovery manuals updated with validated database engine restore commands
