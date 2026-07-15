# ER Diagrams (Entity-Relationship Diagrams)

## 1. Definition & Core Concepts

An Entity-Relationship Diagram (ERD) is a visual blueprint that maps a database's structure, showing the entities (tables), attributes (columns), keys (primary, foreign), and the mathematical relationships between them.

Core concepts:
- **Conceptual, Logical, and Physical Diagrams:**
  - *Conceptual:* High-level business view mapping domain concepts (no database types or keys).
  - *Logical:* Defines table names, column attributes, and relationship constraints (independent of database engine).
  - *Physical:* The actual database implementation map, detailing specific SQL data types, index keys, and nullability constraints.
- **Notation Styles:** Standard visual rules for drawing relationships, most commonly **Crow's Foot Notation** (using symbols like `||` for one-and-only-one, and `0<` for zero-or-many).
- **Cardinality and Ordinality:**
  - *Cardinality:* The maximum number of relationship associations (one or many).
  - *Ordinality:* The minimum number of relationship associations (zero or one, defining optionality).

*(Boundary Note: Code-level ORM visualizer tools, mermaid.js rendering packages in applications, and software diagramming license choices are out of scope. This document covers logical ERD design patterns, relationship notations, and logical-to-physical mapping rules.)*

## 2. Why It Exists / What Problem It Solves

ER Diagrams prevent architectural misalignments. Designing databases by directly writing DDL scripts leads to design flaws, such as missing foreign key references, incorrect cardinalities, or redundant fields. An ERD allows developers and system architects to visualize and critique the data model, verifying business requirements before writing a single line of database code.

## 3. What Breaks in Production Without It

- **Incorrect Schema Cardinality Restrictions:** Implementing a One-to-Many relationship when business requirements require Many-to-Many. Correcting this in production requires expensive table rewrites and data migration scripts.
- **Disconnected Data Islands (Orphans):** Creating tables that have no database-level links to the rest of the schema, leading to data extraction gaps and broken report joins.
- **Documentation Drift:** Failing to maintain a visual schema map. New developers must read thousands of lines of SQL to understand how entities connect, slowing down onboarding and introducing errors.

## 4. Best Practices

- **Use Crow's Foot Notation:** Adopt Crow's Foot notation as the industry standard for logical and physical diagrams.
- **Model Conceptual schemas first:** Start by mapping high-level business concepts with stakeholders before specifying database columns and types.
- **Specify Key Constraints visually:** Mark Primary Keys (PK) and Foreign Keys (FK) explicitly on all tables in logical and physical diagrams.
- **Define Nullability & Optionality:** Mark column nullability (NULL vs NOT NULL) and relationship optionality clearly in the physical diagram.
- **Maintain Diagrams in Version Control:** Store diagrams as text-based declarations (like Mermaid.js or DBML) in the codebase repository, allowing git history tracking and preventing documentation drift.

## 5. Common Mistakes / Anti-Patterns

- **Jumping Straight to DDL:** Skipping the visual modeling phase and immediately writing SQL table creation files, leading to missed constraints.
- **Documentation Out of Sync:** Allowing the ER diagram to drift from the actual production database schema schema state.
- **Omitting Relationship Cardinality:** Drawing lines between tables without specifying if the relationship is 1:1, 1:N, or M:N.
- **Unlabeled Edge Loops:** Drawing circular relationship paths without explaining what business workflows they represent.

## 6. Security Considerations

- **Visualizing Access Boundaries:** Use ERD schematics to visually highlight tables containing PII or credentials, helping security reviewers verify that restricted tables are isolated and require specific authorization scopes.

## 7. Performance Considerations

- **Visualizing Join Complexity:** An ERD makes it easy to identify query performance risk areas, such as long join paths (e.g. joining 7 tables to get profile data) or tables with excessive foreign key links (join hotspots).

## 8. Scalability Considerations

- **Microservice/Shard Boundaries:** Use ER Diagrams to draw boundaries between domains. Tables that have zero logical connections or are loosely coupled are candidates to be split into separate microservice databases or database shards.

## 9. How Major Companies Implement It

- **Amazon:** Conducts formal architecture reviews using physical ER diagrams to approve database schemas before new shopping services are deployed to production.
- **Spotify:** Maintains text-based database blueprints (DBML/Mermaid) inside repository folders, auto-generating schema diagrams on pull requests to ensure changes are reviewed visually.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **ER Diagrams (DBML, Mermaid, Draw.io)** when:
  - Planning a new database schema or modifying an existing complex model.
  - Onboarding developers or document database design for compliance reviews.
  - Reviewing data models with non-technical business stakeholders.
- Skip Detailed ERD creation ONLY when:
  - Building simple, temporary scripts or serverless database instances with fewer than 3 tables.

## 11. AI Coding-Agent Implementation Guidelines

- Always generate a textual Mermaid.js or DBML representation of the proposed database schema before writing the DDL scripts.
- Never propose schema modifications without showing how the relationships connect to existing parent tables in the database map.
- Always mark Primary Keys, Foreign Keys, and column nullability on physical database diagrams.
- Never write diagrams with circular relationship references without clarifying the business logic.

## 12. Reusable Checklist

- [ ] Logical ER Diagram created and reviewed before writing DDL code
- [ ] Diagram uses standard Crow's Foot notation
- [ ] Primary Keys (PK) and Foreign Keys (FK) marked on all tables
- [ ] Relationship cardinalities (1:1, 1:N, M:N) defined
- [ ] Optionality (nullable vs not nullable) indicated on keys and columns
- [ ] No disconnected "data islands" (all tables have defined relationship paths)
- [ ] ERD source code (Mermaid/DBML) stored in version control repository
- [ ] Domain boundaries (PII, credentials) highlighted on the schema map
