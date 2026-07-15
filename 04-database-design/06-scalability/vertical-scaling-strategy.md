# Vertical Scaling (Scale-Up Architecture)

## 1. Definition & Core Concepts

Vertical Scaling (Scale-Up) is the scalability practice of expanding database capacity by upgrading the physical resources of a single server instance (adding more CPU cores, faster RAM, and higher IOPS disk storage).

Core concepts:
- **Single-Node Transactional Capacity:** The maximum write and read transaction volume a single physical server can process while maintaining immediate ACID consistency.
- **Disk IOPS (Input/Output Operations Per Second):** The measure of storage performance. High-performance databases rely on NVMe SSD stripes or provisioned cloud storage IOPS.
- **OS Kernel Tuning:** Optimizing operating system configurations (e.g. file descriptor limits, virtual memory swap settings, and huge pages) to allow the database engine to utilize the upgraded hardware fully.
- **Database Thread/Process Bounds:** Engine-level parameters that dictate thread allocation and memory pool sizes to match the host hardware capacity.

*(Boundary Note: Virtual machine hypervisor setups, cloud instance class comparison tables, and physical server rack installations are out of scope. This document covers database-native memory tuning, OS kernel properties, disk IOPS limits, and write ceilings.)*

## 2. Why It Exists / What Problem It Solves

Vertical scaling is the most straightforward way to scale a database. Unlike horizontal scaling, which distributes data across a network and introduces eventual consistency, network latency, and partition splits, vertical scaling preserves immediate ACID consistency. All transactions run on a single machine, meaning joins, constraints, and multi-row updates execute with zero network overhead.

## 3. What Breaks in Production Without It (or When Misapplied)

- **OS File Descriptor Exhaustion:** Upgrading server hardware to 128 cores and 1TB of RAM, but leaving default OS-level kernel limits (e.g., `ulimit -n` at 1024). During a connection spike, the database fails to open socket connections, crashing the API.
- **Hardware Performance Ceilings:** The database hits physical resource ceilings (e.g. maximum cloud instance sizes). If write traffic continues to grow, the database cannot scale up further, leading to CPU saturation and outages.
- **Exponential Cloud Cost Spikes:** Instance prices do not scale linearly. Upgrading to the largest enterprise instances is exponentially more expensive than running multiple smaller instances, bloating cloud budgets.
- **Thread Lock Contention:** Allocating excessive CPU cores to engines with lock bottlenecks. In some SQL versions, having >64 cores increases internal mutex lock contention, slowing down query speeds.

## 4. Best Practices

- **Scale Vertically First:** Always exhaust vertical scaling limits and optimize queries before adopting horizontal sharding. Vertical scale keeps operational complexity low.
- **Tune Memory Parameters to Match Hardware:** Optimize database-native memory settings to utilize system RAM. In PostgreSQL, tune `shared_buffers`, `effective_cache_size`, `work_mem`, and `maintenance_work_mem` based on host memory size.
- **Provision High-IOPS Storage (NVMe/RAID):** Use RAID 10 arrays or provisioned IOPS SSDs to prevent disk queues from becoming write transaction bottlenecks.
- **Configure OS Kernel Settings:**
  - Increase the maximum open files limits (`ulimit -n 65536`).
  - Configure Linux huge pages (`vm.nr_hugepages`) to optimize memory page table lookups.
  - Decrease swap aggressiveness (`vm.swappiness = 1` or `10`) to prevent the OS from writing active database memory to disk.
- **Implement Read-Write Splitting Before Sharding:** If read traffic is saturating CPU, deploy read replicas (Scale-Out Reads) while keeping the primary write node vertically scaled, postponing sharding.

## 5. Common Mistakes / Anti-Patterns

- **Throwing Hardware at Bad SQL:** Upgrading instance sizes to fix slow queries caused by missing indexes or un-optimized join paths.
- **Leaving Default Engine Configurations:** Running a 256GB RAM database server with default SQL installation memory parameters (e.g. Postgres default `shared_buffers` at 128MB).
- **Ignoring OS-Level Thread Limits:** Leaving kernel constraints at default settings on high-spec machines.
- **Single Disk Bottlenecks:** Placing database tables, indexes, and Write-Ahead Logs (WAL) on a single physical disk, creating disk I/O contention. Isolate WAL writes to a dedicated disk.

## 6. Security Considerations

- **Single Host Protection:** Because a vertically scaled database stores all data on a single machine, encrypt all storage disks (encryption at rest) and configure host firewalls to restrict access strictly to application subnets.

## 7. Performance Considerations

- **Memory Bus Bandwidth:** When purchasing hardware, select memory channels with high bandwidth. Databases are highly memory-intensive; memory transfer speed can bottleneck transaction processing faster than raw CPU speed.

## 8. Scalability Considerations

- **The Write Wall:** Write capacity on a single node is physically limited by the disk write speed of the WAL and CPU transaction coordination speed. When write volume hits this wall, horizontal sharding is the only path forward.

## 9. How Major Companies Implement It

- **Stripe:** Scales database nodes vertically to maximum cloud instance sizes (e.g. 64+ cores, 512GB+ RAM) before implementing sharding partitions, prioritizing transaction safety.
- **GitHub:** Operates vertically scaled primary MySQL clusters backed by NVMe SSD storage arrays, keeping read-write architectures simple.

## 10. Decision Checklist (Vertical Scaling Framework)

Scale up the database when:

- **Database size** is under 1.5TB and writes are within single-server IOPS limits.
- **Immediate ACID consistency** across all tables is a core system requirement.
- **Operational simplicity** is a key constraint (small DBA team).
- **Query patterns** require complex, ad-hoc joins that would fail in distributed NoSQL environments.

## 11. AI Coding-Agent Implementation Guidelines

- Always check that database configuration scripts tune memory parameters to match host RAM.
- Never suggest horizontal sharding if the database size is estimated to stay under 1TB and writes can scale vertically.
- Always recommend configuring OS kernel parameters (swappiness, open files) in database setup scripts.
- Never write database setups that put transaction logs (WAL) and primary tables on the same physical disk partition.
- Always verify that B-Tree indexes are optimized before recommending hardware upgrades.

## 12. Reusable Checklist

- [ ] Database memory parameters (`shared_buffers` / `innodb_buffer_pool_size`) tuned to match host RAM
- [ ] OS open files limit (`ulimit -n`) increased to at least 65,536
- [ ] Linux swappiness (`vm.swappiness`) set to 1 or 10 (prevents memory swapping)
- [ ] Write-Ahead Log (WAL) stored on a dedicated, physical disk partition
- [ ] Provisioned storage IOPS and NVMe RAID arrays configured for database disks
- [ ] Database statistics and indexes optimized before hardware scale-up
- [ ] Statement timeouts active to prevent resource locks on a single server
- [ ] Disk encryption active on the host machine storage volumes
