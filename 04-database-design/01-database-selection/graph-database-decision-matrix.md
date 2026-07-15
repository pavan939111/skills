# Graph Database

## 1. Definition & Core Concepts

A Graph Database stores and queries data using a graph model consisting of **Nodes** (entities, e.g., Users, Products), **Edges** (relationships, e.g., Follows, Purchased), and **Properties** (key-value attributes attached to nodes or edges).

Core pieces:
- **Index-Free Adjacency:** The core architecture where nodes contain direct physical pointers to their adjacent nodes on disk/memory, allowing traversal of relationships without performing expensive index lookups or SQL table joins.
- **Edges (Directed & Typed):** Connections representing explicit relationships. Edges always have a direction (incoming/outgoing) and a label type.
- **Graph Query Languages:** Specialized declarative languages for pattern matching and path traversal, such as Cypher (used by Neo4j) or Gremlin (TinkerPop standard).
- **Path Traversal:** Algorithms that navigate from a starting node along connected edges to target nodes (e.g., Shortest Path, Breadth-First Search).

*(Boundary Note: UI graph visualization libraries, code-level graph mappers, and API routing controllers are out of scope. This document covers database-engine selection, graph modeling guidelines, and traversal limits.)*

## 2. Why It Exists / What Problem It Solves

Relational databases require executing complex, slow recursive JOIN statements (or Common Table Expressions) to trace connections multiple levels deep (e.g. "find friends of friends who bought product X"). In relational databases, query latency increases exponentially with the number of relationship levels (hops). Graph databases resolve this by navigating direct node memory pointers, keeping traversal latency constant regardless of the overall size of the database.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Out of Memory (OOM) Crashes from Supernodes:** A single node has millions of connected edges (e.g., a celebrity user in a social network). Querying relationships on this "Supernode" causes the traversal engine to load millions of pointers into RAM, crashing the JVM/heap.
- **Runaway Traversal Queries:** Executing queries without path length bounds (e.g., searching for connections `MATCH (p1)-[*]->(p2)`). The engine attempts to traverse the entire global graph, locking CPU cores and timing out.
- **Graph Scan Failures:** Running queries without specifying node labels, forcing the engine to perform full database scans across every node in storage.
- **Partitioning Data Collisions:** Attempting to shard a graph database across multiple servers. Because graphs contain cross-boundary relationships, queries must execute expensive network calls to hop between servers, eliminating the pointer performance advantage.

## 4. Best Practices

- **Index Node Lookup Properties:** Create indexes on the unique identifiers and properties used to locate the starting nodes of a traversal (e.g. `User.email` or `Product.sku`).
- **Enforce Strict Hop Limits:** Always define maximum relationship depths in queries (e.g., limit paths to 3 hops: `MATCH (u1)-[:FRIEND*1..3]-(u2)`). Never write unbounded path queries.
- **Model Edge Types Explicitly:** Use specific, low-cardinality labels for edges (e.g. `WRITES_COMMENT` instead of a generic `ACTION`). This allows traversal engines to ignore irrelevant relationships.
- **Mitigate Supernodes:** Avoid attaching millions of edges to a single node. If unavoidable, split supernodes into logical clusters, or aggregate relationships using relational schemas or counters on the node.
- **Set Up Heap Sizing Carefully:** Graph databases execute traversals in memory. Configure the database JVM heap space and page cache limits to fit the active graph partition in RAM.

## 5. Common Mistakes / Anti-Patterns

- **Using Graph for Non-Connected Tabular Data:** Storing flat, independent entity records (like simple user accounts or transaction logs) that have no natural network relationships, creating unnecessary indexing overhead.
- **Storing Large Blobs in Properties:** Saving files, long descriptions, or image binaries inside node properties, which inflates node record size and slows down memory traversal. Store URLs instead.
- **Ignoring Edge Direction:** Writing queries that ignore edge direction arrows, forcing the database to double search paths.
- **No Node Labels in Queries:** Writing generic match queries that omit labels (e.g. `MATCH (n) WHERE n.id = X`), causing full database scans.

## 6. Security Considerations

- **Graph Gating Authorization:** Authorizing access to specific sub-graphs is complex. Ensure query parameters are structured to prevent users from traversing into node relationships they are not authorized to view (e.g. checking tenant ID tags on every path hop).

## 7. Performance Considerations

- **Read vs. Write Trade-off:** Navigating pointers makes reads extremely fast, but creating nodes and linking edges involves updating multiple pointer addresses on disk, making graph database writes slower than relational database writes.
- **Warm Page Caches:** Keep the active traversal graph cached in memory using database page-cache configuration settings to avoid disk lookups.

## 8. Scalability Considerations

- **Single-Master Writes:** Most graph databases (like Neo4j) use active-passive replication where a single primary node handles writes, and read replicas handle read traversals, limiting total write scalability. Choose distributed graph databases (like AWS Neptune or JanusGraph) for high-scale multi-node writes.

## 9. How Major Companies Implement It

- **Uber:** Uses graph database models to analyze driver-passenger-device networks, identifying fraud rings (e.g. multiple accounts linked to the same credit card or device fingerprint).
- **LinkedIn:** Developed custom graph engines to calculate connection degrees (1st, 2nd, 3rd connections) and serve professional network updates in real-time.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **Graph Databases (Neo4j, Amazon Neptune)** when:
  - Data relationships are highly connected, recursive, and deep (e.g. social networks, fraud detection, recommendation paths, dependency trees).
  - Relationship details (properties on edges) are as important as the entities themselves.
  - Queries require tracing connections multiple levels deep (3+ hops).
- Use **Relational or Key-Value Databases** when:
  - Tabular CRUD operations dominate (e.g., standard billing, user accounts).
  - Bulk, sequential data writes (e.g., logs, time-series metrics) are the primary workload.
  - Data has simple or minimal relationships.

## 11. AI Coding-Agent Implementation Guidelines

- Always specify exact node labels (e.g. `:User`) and relationship directions (e.g. `->`) in query statements.
- Never write open-ended relationship path traversals without explicit depth limits (e.g. use `*1..3`, never `*`).
- Always create unique constraints and indexes on initial node search properties.
- Never store large file assets or binary data inside node properties.
- Always include tenant filtering criteria on all path validation steps in multi-tenant graphs.

## 12. Reusable Checklist

- [ ] Node indexes created for starting lookup keys (e.g. `uuid`, `email`)
- [ ] Queries specify node labels to prevent full graph scans
- [ ] Hop limits (depth constraints) configured on all traversal queries (e.g., `*1..3`)
- [ ] Relationship direction arrows explicitly defined in queries
- [ ] Supernodes mitigated (no single node contains >10,000 edge connections)
- [ ] Database page cache and JVM heap memory sized to fit the active graph working set
- [ ] No binary blobs or long text descriptions stored in node/edge properties
- [ ] Sub-graph access control filters applied on multi-tenant queries
- [ ] Write operations isolated from high-volume batch logging streams
