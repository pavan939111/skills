# AI Medical Assistant Template

## 1. Definition & Core Concepts
An AI Medical Assistant is a template designed to transcribe doctor-patient conversations, extract clinical entities, generate structured clinical summaries (e.g. SOAP notes), search medical knowledge bases, and prepare draft patient summaries under strict regulatory and safety frameworks.

## 2. Why It Exists / What Problem It Solves
Doctors spend hours writing EHR clinical notes. A production-ready medical assistant automates this documentation workload while ensuring complete data privacy (HIPAA compliance), eliminating medical hallucinations, and enforcing mandatory human doctor approval (HITL) gates.

## 3. What Breaks in Production Without It
- **Clinical Hallucinations:** The model invents medical diagnoses or dosage details, creating critical patient safety risks.
- **HIPAA Compliance Outages:** Patient health details are sent to consumer endpoints that do not sign BAAs or guarantee data isolation, resulting in legal audits.
- **Inaccurate Coding:** The assistant maps medical procedures to incorrect billing codes, causing invoice denials.

## 4. Best Practices
- **Model Selection:** Use high-reasoning models (e.g. GPT-4o, Claude 3.5 Sonnet) that have been calibrated or fine-tuned on medical terminology datasets.
- **Context/Prompt/Knowledge Strategy:** Ground all answers strictly on official medical guidelines (like UpToDate or PubMed). Ensure the system prompt specifies: "You are a clinical scribe. Do not offer independent diagnoses; only summarize the observed dialogue."
- **Agent/RAG Pattern:** Implement a Workflow Pattern with a strict, non-autonomous sequence: Transcribe -> Extract SOAP entities -> Map billing codes -> Doctor review.
- **Evaluation:** Run evaluations measuring clinical completeness, code accuracy, and safety alignment against certified medical golden datasets.
- **Deployment:** Deploy systems exclusively on HIPAA-compliant cloud clusters, routing all data through encrypted tunnels with detailed access auditing.

## 5. Common Mistakes / Anti-Patterns
- **Autonomous prescribing:** Allowing the model to output prescription drafts or diagnostic instructions directly to patients without physician verification.
- **Assuming generic compliance:** Using third-party tools that lack signed BAAs, violating healthcare data sovereignty rules.

## 6. Security Considerations
- **EHR Integration Security:** Ensure that patient data fetched from electronic health record (EHR) databases is isolated in-memory and never cached in shared model environments.

## 7. Performance Considerations
- **Medical speech transcription:** Deploy high-accuracy, clinical-grade speech-to-text models (e.g., Whisper fine-tuned on medical dialects) to prevent spelling errors in drug names.

## 8. Scalability Considerations
- **Durable Audit Trail Logging:** Maintain compliance logs of doctor-patient sessions for regulatory review, storing records in encrypted, WORM-compliant databases.

## 9. How Major Companies Implement It
- **Nuance DAX (Microsoft):** Captures clinical dialogue at the point of care, transcribes interactions automatically, and converts transcripts into structured clinical notes for electronic health records.

## 10. Decision Checklist (Medical Assistant Blueprint)
- **Model Selection:** GPT-4o / Claude 3.5 Sonnet (Compliance BAA tier).
- **Transcription Engine:** Whisper Medical-Fine-Tuned.
- **Human Oversight:** 100% of SOAP notes, diagnostic summaries, and codes require physician validation before EHR sync.
- **Compliance standard:** HIPAA compliant data isolation with regional boundary locks.

## 11. AI Coding-Agent Guidelines
- Write API controllers that route encrypted audio files to transcription services, extract clinical data, format SOAP structures, and post to EHR validation queues.

## 12. Reusable Checklist
- [ ] BAA contract signed with model provider and hosting platforms
- [ ] Model instructions forbid independent diagnostics and enforce scribing boundaries
- [ ] EHR database connections utilize strict, token-based role authorizations
- [ ] 100% of generated SOAP notes and billing codes require doctor verification
- [ ] Audio transcription services utilize specialized medical vocabulary models
- [ ] Audit logs track every instance of patient record access and change history
