# Queue Selection Framework

### 1. The Question Decided
"What is the overall structured decision path used to select message broker engines and routing protocols across all system domains?"

### 2. Options Compared
| Criteria / Context | AWS SQS | RabbitMQ | Apache Kafka |
|---|---|---|---|
| **Simple Background Jobs** | Best Match | Fair | Poor |
| **Complex Routing / AMQP** | Poor | Best Match | Fair |
| **High-Volume Event Streams**| Poor | Fair | Best Match |

### 3. Decision Rule
- **Follow the queue selection tree:**
  - *If* workload is basic async tasks (e.g. email jobs) and hosted in AWS, *then* select **AWS SQS**.
  - *If* workload requires smart routing exchanges, *then* select **RabbitMQ**.
  - *If* workload is high-volume streaming logs or event sourcing, *then* select **Apache Kafka**.

### 4. Red Flags to Revisit
- The application architecture becomes over-engineered because the team runs a complex Kafka cluster to process a few hundred background email jobs daily.
- Message processing lags because the queue engine lacks the scaling headroom required by the business traffic.

### 5. Where to Go Next
- For the master resource on setting up, configuring, and writing background messaging logic in production, see Message Broker Architecture & Implementation.
