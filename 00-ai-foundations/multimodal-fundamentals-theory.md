# Multimodal Fundamentals

## 1. Definition & Core Concepts
Multimodal AI refers to models that process and generate multiple modalities (text, images, audio, video) concurrently. They project different input types (e.g. image pixels and text strings) into a shared vector space, mapping semantic meanings across modalities.

## 2. Why It Matters for Building AI Products
Multimodality enables applications to read scanned documents (OCR replacement), analyze charts, transcribe audio in real-time, generate images, and build vision assistants.

## 3. How It Actually Works
- **Modality Encoders:** Converts non-text assets into vectors:
  - *Vision Transformer (ViT):* Splits images into $16\times16$ pixel patches, treating them as tokens in a sequence.
  - *Audio Encoder:* Converts waveforms to spectrograms before running convolutions.
- **Contrastive Learning (e.g. CLIP):** Trains text and image encoders to maximize dot product alignments on matching image-text pairs.
- **Cross-Attention Routing:** Connects vision/audio representations directly to decoder attention layers.

## 4. Common Misconceptions
- **Multimodal models perform OCR:** Modern vision models do not transcribe text character-by-character; they identify concepts and text patterns semantically.
- **Video is processed natively:** Video is typically split into image frames, sampling a set number of frames per second to stay within context limits.

## 5. How It Constrains What's Possible in `05-ai-engineering/`
- **Context Window depletion:** A single image token payload consumes massive token allocations (e.g. one image = 85 to 258 text tokens).
- **OCR Accuracy drops:** Small or vertically oriented text (like maps or technical charts) can be misread because models lack fine-grained pixel grids.

## 6. Key Terminology Glossary
- **Vision Transformer (ViT):** Image encoder architecture treating patches as tokens.
- **CLIP (Contrastive Language-Image Pre-training):** Model mapping text and images into a shared embedding space.
- **Modality Adapter:** Light linear mapping layers translating image features into text token equivalents.

## 7. Further Reading / Primary Sources
- *Learning Transferable Visual Models From Natural Language Supervision (CLIP)* (Radford et al., 2021)
- *An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale* (Dosovitskiy et al., 2020)

## 8. AI Coding-Agent Guidelines
- **Resize Images:** Pre-scale images to model specifications (e.g. 512x512) before submitting API payloads to minimize token usage.
- **Handle Audio Stream Chunks:** Split audio streams into 30-second segments before running transcription models (like Whisper) to avoid processing overhead.
