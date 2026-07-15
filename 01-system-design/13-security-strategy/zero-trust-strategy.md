# Zero Trust Security Strategy

### 1. The Question Decided
"Should the network architecture adopt Zero Trust Security parameters (never trust, always verify), and how are internal service interfaces isolated?"

### 2. Options Compared
| Dimension | Perimeter Security (Classic VPN) | Zero Trust Network Access (ZTNA) | Service Mesh mTLS |
|---|---|---|---|
| **Cost** | Low | Medium-High | High |
| **Complexity** | Low | High | Very High |
| **Isolation** | Low (Internal network trusted) | High (Continuous verification) | Extremely High |
| **B2B scale fit** | Poor | Good | Best Match |

### 3. Decision Rule
- **Choose Service Mesh mTLS if:** Operating distributed microservices where every network packet between internal containers must be encrypted, and client identities verified at every hop.
- **Choose Perimeter Security if:** Building simple monoliths on private virtual networks where standard firewall rules and IP whitelists are sufficient.

### 4. Red Flags to Revisit
- An attacker compromises a web router and gains immediate, un-authenticated access to the primary database because internal database connections lack SSL validation.
- Internal services communicate via plaintext HTTP, leaving logs vulnerable to internal network sniffing.

### 5. Where to Go Next
- For configuring secure network boundaries, firewall rules, and VPC isolation parameters, see [Security Foundations](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/foundations/04-security.md).
