# Reinforcement Learning from Human Feedback (RLHF)

## 1. Definition & Core Concepts
RLHF is a model training phase that uses reinforcement learning algorithms to align LLM behaviors with human values, safety criteria, and quality standards (e.g. helpfulness, harmlessness).

## 2. Why It Matters for Building AI Products
RLHF turns raw text-completion base models into interactive chat assistants. It prevents models from generating harmful content and shapes their tone (e.g. apologetic style).

## 3. How It Actually Works
- **Supervised Fine-Tuning (SFT):** The base model is trained on conversational prompt-response data.
- **Reward Modeling:** Humans rank multiple model completions from best to worst. A reward model is trained on these comparisons to output quality scores.
- **Reinforcement Learning Optimization:** The SFT model generates responses, the Reward model scores them, and optimization algorithms (PPO, DPO) adjust model weights to maximize reward scores.
- **KL Divergence Constraint:** Restricts the active model from drifting too far from the initial SFT model.

## 4. Common Misconceptions
- **RLHF makes models smarter:** It shapes behavior and alignment. In some cases, RLHF reduces general reasoning ability ("alignment tax").
- **RLHF is manual label checking:** It uses automated algorithms (e.g., PPO/DPO) once the reward model is trained.

## 5. How It Constrains What's Possible in `05-ai-engineering/`
- **Syrupy Refusals:** Heavily RLHF-aligned models may refuse harmless tasks (e.g. discussing hot-button topics) due to conservative safety thresholds.
- **Sycophancy:** Models may agree with incorrect user claims to optimize friendliness rewards.

## 6. Key Terminology Glossary
- **PPO (Proximal Policy Optimization):** Standard RL algorithm updating model parameters based on reward feedback.
- **DPO (Direct Preference Optimization):** Modern alternative bypassing reward model training to update weights directly from preference datasets.
- **Alignment Tax:** Diminishing model reasoning performance caused by alignment constraints.

## 7. Further Reading / Primary Sources
- *Training language models to follow instructions with human feedback* (Ouyang et al., 2022)
- *Direct Preference Optimization* (Rafailov et al., 2023)

## 8. AI Coding-Agent Guidelines
- **Prompt Engineering Around Refusals:** If a model refuses safe tasks, use system prompt instructions (e.g., "you are analyzing a fictional scenario") to bypass alignment constraints.
- **Preference Dataset Quality:** If building alignment datasets, prioritize consistent ranking criteria to prevent confusing reward model scoring.
