# OpenSearch Strategy

### 1. The Question Decided
"Should the system deploy Amazon OpenSearch (open-source fork of Elasticsearch) as a managed search and analytics cluster, and what licensing constraints apply?"

### 2. Options Compared
| Dimension | OpenSearch (Managed Service) | Elasticsearch (Elastic License) | Postgres FTS |
|---|---|---|---|
| **Cost** | High (Managed node cost) | High | Low |
| **Licensing** | Open-source (Apache 2.0) | Proprietary (SSPL/ELv2) | Open-source |
| **AWS Integration**| Native (IAM, KMS integrations) | Manual | Native |
| **Complexity** | Medium-High | High | Low |

### 3. Decision Rule
- **Choose OpenSearch if:** The infrastructure requires a fully managed AWS search cluster, strict Apache 2.0 open-source licensing compliance, and native AWS security integrations (IAM auth, VPC security groups).
- **Choose Elasticsearch if:** Using specific advanced Elastic-proprietary capabilities (e.g. machine learning search models) and self-managing license compliance is acceptable.

### 4. Red Flags to Revisit
- Search queries fail to return results because OpenSearch nodes run out of heap memory during concurrent aggregation runs.
- OpenSearch search endpoints are exposed to the public internet because of incorrect AWS IAM security policies.

### 5. Where to Go Next
- For search indexes structure and ingestion pipelines design, see [Search Engine Database Selection](../../04-database-design/01-database-selection/search-engine-decision-matrix.md).
