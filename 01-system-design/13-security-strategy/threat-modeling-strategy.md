# Threat Modeling Strategy

### 1. The Question Decided
"Which threat modeling methodology (e.g. STRIDE, DREAD) governs system design safety audits, and how are database boundaries protected against primary threats?"

### 2. Options Compared
| Methodology | STRIDE (Spoofing, Tampering, etc.) | DREAD (Damage, Reproducibility, etc.) | PASTA (Process for Attack Simulation) |
|---|---|---|---|
| **Primary Focus** | Threat classification | Risk prioritization | Risk assessment |
| **Complexity** | Low-Medium | Medium | High |
| **Suitability** | Technical architecture audits | Risk classification | Enterprise business alignments |

### 3. Decision Rule
- **Choose STRIDE if:** Auditing technical system design components (gateways, databases, services) to verify specific vulnerability defenses (e.g. input injection, data tampering).
- **Choose DREAD if:** Assigning numeric risk priority ranks to identified system security vulnerabilities.

### 4. Red Flags to Revisit
- System updates are deployed without threat audits, leading to SQL injection vulnerabilities on public endpoints.
- Security resources are wasted resolving low-risk vulnerabilities while leaving major spoofing pathways open.

### 5. Where to Go Next
- For threat mitigation patterns, network boundaries setups, and secure coding practices, see [Security Foundations](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/foundations/04-security.md).
