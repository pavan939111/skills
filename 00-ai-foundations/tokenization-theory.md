# Tokenization

## 1. Definition & Core Concepts
Tokenization is the process of converting raw character strings into discrete numeric pieces (tokens) that an AI model can parse. It maps human-readable characters to indices in the model's vocabulary matrix. Modern tokenization uses subword algorithms (Byte-Pair Encoding, WordPiece) to balance vocabulary size and out-of-vocabulary exceptions.

## 2. Why It Matters for Building AI Products
Models do not read words; they read tokens. Tokenization controls API billing metrics, context window usage, character limits, and model performance on non-English text or source code.

## 3. How It Actually Works
- **Subword Splitting:** The tokenizer splits strings into common character chunks (e.g. "tokenization" $\rightarrow$ "token", "ization").
- **Byte-Pair Encoding (BPE):** Iteratively merges the most frequent pairs of bytes or characters in a corpus to construct a vocabulary of set size (e.g., 32,000 to 100,000 tokens).
- **Special Tokens:** Inject structural markers like `<|endoftext|>` or `<s>` to declare sequence boundaries.

## 4. Common Misconceptions
- **1 Token = 1 Word:** In English, 1 token averages $\approx 0.75$ words. In other languages or code, a single word can be split into 5+ tokens.
- **Spaces are ignored:** Spaces are part of the token byte sequence. Adding trailing spaces to prompts can lead to unexpected model completions due to prefix-matching bugs.

## 5. How It Constrains What's Possible in `05-ai-engineering/`
- **Cost Calculations:** API pricing is billed per token. Unoptimized data representations (XML, JSON, base64) consume more tokens, increasing billing costs.
- **Validation Issues:** Tokenizers struggle with character-level operations (e.g., counting letters, reversing strings, solving anagrams).

## 6. Key Terminology Glossary
- **Byte-Pair Encoding (BPE):** Compression algorithm used to build subword vocabularies.
- **Vocabulary Size:** The total number of unique tokens the model can recognize.
- **Out of Vocabulary (OOV):** Characters the tokenizer cannot parse, falling back to unknown characters placeholders.

## 7. Further Reading / Primary Sources
- *Byte-Pair Encoding Tokenization* (Sennrich et al., 2015)
- *Tiktoken library* (OpenAI tokenizer)

## 8. AI Coding-Agent Guidelines
- **Prompt Space Management:** Avoid unnecessary trailing spaces or whitespace formatting inside prompt templates to prevent tokenizer errors.
- **Count Validation:** When building agent loops, utilize native tokenizer libraries (like `tiktoken` or `transformers`) to verify token counts before calling APIs.
