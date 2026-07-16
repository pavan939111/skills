# Fine-Tuning vs Prompting Decision

### 1. The Question Decided
"Should we solve our target domain capabilities gap using Prompt Engineering (few-shot, RAG) or run custom Fine-Tuning adapters?"

### 2. Options Compared
| Criteria | Prompt Engineering / RAG | Custom Fine-Tuning |
|---|---|---|
| **Best For** | Fact retrieval, dynamic information | Formatting consistency, specialized task style |
| **Setup Cost** | Low | High |
| **Token Cost** | High (long prompt contexts) | Low (shorter target contexts) |
| **Update Speed** | Instant | Slow (hours/days training) |

### 3. Decision Rule
- **Choose Prompt Engineering / RAG** for knowledge-based query interfaces where documents update hourly or daily.
- **Choose Fine-Tuning** when:
  - Shifting base style, tone, or formatting structure (e.g., teaching a model custom DSL codes).
  - Attempting to reduce context token usage and API costs at large transaction volumes.

### 4. Red Flags to Revisit
- Fine-tuning a model to "know" static factual data, which fails because neural networks hallucinates static records over time.
- Prompt contexts grow so large that API costs exceed fine-tuning setup costs.

### 5. Where to Go Next
- For prompts and context setup guidelines, see [Prompt Template Management](../../05-ai-engineering/04-prompt-template-management/index.md).
