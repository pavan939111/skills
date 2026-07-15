# Technical Constraints

## 1. What Question This Answers
"What are the pre-existing technical boundaries (legacy codebases, mandatory hosting platforms, version limitations, third-party integrations) and how do they restrict system design?"

## 2. Why It Matters at the System-Design Stage
A system design cannot be implemented if it conflicts with the client's pre-existing technical constraints. For example, an architect may design a modern serverless API, but if the company's IT policy mandates deployment to on-premise physical servers using Docker Swarm, the design is unbuildable. Technical constraints define the fixed engineering parameters that the architecture must accommodate.

## 3. Methodology / How to Work Through It
1. **Identify Hosting Constraints:** Document the required cloud provider (AWS, GCP, Azure), hosting models (Kubernetes, serverless, virtual machines), and physical hardware limitations.
2. **Audit Legacy Systems:** Identify pre-existing databases, schemas, or APIs that the new system must read from or write to.
3. **Verify Version Requirements:** Document specific software, language, or database version constraints (e.g. must support legacy MySQL 5.7).
4. **Identify Client Device Limits:** Check if target devices have hardware limits (e.g., low-performance mobile devices, offline environments).
5. **Establish Technical Integration Rules:** Map how modern components will communicate with legacy systems (e.g. using adapter patterns or event streaming gateways).

## 4. Inputs Needed
- Product constraints and project scope from [Product Analysis](file:///c:/Users/mahip/OneDrive/Desktop/skills/00-product-analysis/index.md).
- Current server infrastructure inventories.

## 5. Outputs Produced
- Feeds into [Architecture Selection](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/03-architecture-selection/index.md) and [Component Design](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/04-component-design/index.md).

## 6. Worked Example (Enterprise Inventory Upgrade)
- **Infrastructure Constraint:** Deployments must target AWS, restricted to EC2 virtual machines (no managed Kubernetes or serverless).
- **Legacy Integration:** Must sync with a legacy Microsoft SQL Server database (managed by an external team, read-only access).
- **Version Constraint:** Client applications are legacy Android terminals running Android 9 with variable local network dropouts.
- **System Design Decisions:**
  - *Data Sync:* Deploy a background worker using CDC or outbox tables to sync inventory changes from the legacy SQL Server to a local PostgreSQL database on EC2.
  - *Network Tolerance:* Configure the mobile client application with local SQLite databases for offline support, syncing data when connected.
  - *Process Model:* Package services in Docker containers deployed to EC2 instances using basic Docker Compose.

## 7. Common Mistakes
- **Assuming Modern Tech Availability:** Proposing managed cloud database engines without verifying if the target environment supports them (e.g. designing for RDS when restricted to on-premise private clouds).
- **Ignoring Version Incompatibilities:** Designing queries using modern database functions (e.g., pgvector HNSW indexes) when the client is locked to an older database version (e.g., PostgreSQL 11).
- **Bypassing Network Realities:** Assuming infinite network bandwidth and zero latency for client devices.

## 8. AI Coding-Agent Guidelines
1. **Identify Hosting Platform:** Ask: "What cloud provider or hosting model is required? Are there on-premise constraints?"
2. **Audit Database Version limits:** Ask: "What database engines and versions are pre-installed? Can we select new databases?"
3. **Check Network Requirements:** Ask: "Are there offline support or low-bandwidth constraints?"
4. **Produce Technical Constraints Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Technical Constraints Analysis: [System Name]

### 1. Hosting & Cloud Provider Constraints
- **Mandatory Provider:** [e.g. AWS / GCP / On-Premise VM]
- **Deployment Platform:** [e.g., EC2 VMs only; no managed Kubernetes or serverless allowed]
- **Target OS/Environment:** [e.g. Linux Ubuntu 22.04 LTS]

### 2. Legacy Systems & Database Dependencies
- **Pre-existing Database:** [e.g. MS SQL Server (Read-only integration required)]
- **Integration Protocol:** [e.g. JDBC connector, sync scheduled hourly]
- **Database Version Constraints:** [e.g. Must run on PostgreSQL 13 (no pgvector support)]

### 3. Client & Network Constraints
- **Target Devices:** [e.g. Handheld barcode scanners, low-memory mobile Android 10 devices]
- **Network Quality:** [e.g., Variable cellular network coverage in warehouses; system must tolerate offline states]

### 4. Architectural Rules
- **Integration Strategy:** [e.g. Use local replica tables in PostgreSQL to read legacy data, avoiding direct network hops on SQL Server during checkouts.]
- **Offline Strategy:** [e.g. Client cache active using SQLite database; sync event outbox table logs offline mutations.]
```
