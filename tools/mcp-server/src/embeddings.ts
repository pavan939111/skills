import { pipeline } from '@xenova/transformers';

let extractor: any = null;

export async function getExtractor() {
  if (!extractor) {
    // Feature extraction pipeline using all-MiniLM-L6-v2
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractor;
}

export async function embedText(text: string): Promise<Float32Array> {
  const pipe = await getExtractor();
  
  // Compute raw token-level embeddings tensor: shape [1, sequence_length, 384]
  const output = await pipe(text);
  
  const dims = output.dims; // [batch_size, seq_len, hidden_dim]
  const data = output.data as Float32Array;
  
  const seqLen = dims[1];
  const dim = dims[2];
  
  // 1. Mean Pooling across sequence dimension
  const mean = new Float32Array(dim);
  for (let d = 0; d < dim; d++) {
    let sum = 0;
    for (let s = 0; s < seqLen; s++) {
      sum += data[s * dim + d];
    }
    mean[d] = sum / seqLen;
  }
  
  // 2. L2 Normalization
  let sumSq = 0;
  for (let d = 0; d < dim; d++) {
    sumSq += mean[d] * mean[d];
  }
  const norm = Math.sqrt(sumSq) || 1.0;
  for (let d = 0; d < dim; d++) {
    mean[d] /= norm;
  }
  
  return mean;
}

export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dotProduct = 0;
  const len = a.length;
  for (let i = 0; i < len; i++) {
    dotProduct += a[i] * b[i];
  }
  return dotProduct;
}
