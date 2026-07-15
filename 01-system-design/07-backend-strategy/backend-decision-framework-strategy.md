# Backend Decision Framework

### 1. The Question Decided
"What is the overall structured decision path used to align framework selection, service code design, and background tasks execution with active project requirements?"

### 2. Options Compared
| Decision Boundary | Lightweight Router | Opinionated Framework | Distributed Sagas |
|---|---|---|---|
| **Simple CRUD App** | Best Match | Fair | Poor |
| **B2B SaaS / Enterprise** | Fair | Best Match | Fair |
| **High-Scale Microservices**| Best Match | Fair | Best Match |

### 3. Decision Rule
- **Align backend choices with team capacity and scale:**
  - *If* team size $<15$ and timeline is short, *then* select **Lightweight Router** (in Node.js/Python) and **Transaction Script/Active Record** patterns.
  - *If* team size $>25$ or security domains are highly isolated, *then* select **Opinionated Framework** (Spring Boot/NestJS), **Domain Model (DDD)** patterns, and **Distributed Workers**.

### 4. Red Flags to Revisit
- The backend codebase experiences frequent compile errors or schema drift because developers lack clear folder conventions.
- System throughput collapses because database queries block API routing threads.

### 5. Where to Go Next
- For configuring, building, and deploying backend applications, see [Backend Development Reference Map](file:///c:/Users/mahip/OneDrive/Desktop/skills/backend-development/README.md).
- For translating system architectures to folders structure, see [Project Structure Guide](file:///c:/Users/mahip/OneDrive/Desktop/skills/backend-development02-directory-structure/index.md).
