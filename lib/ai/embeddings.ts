import { createHash } from 'crypto';

const DEFAULT_DIMENSIONS = 256;
const DEFAULT_MODEL = 'local-hash-embedding-v1';
const ACCENT_MARKS_REGEX = /[\u0300-\u036f]/g;

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(ACCENT_MARKS_REGEX, '');
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(/[^a-z0-9äöüß]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest();
}

export interface EmbeddingResult {
  model: string;
  vector: number[];
}

export function embedText(text: string, dimensions = DEFAULT_DIMENSIONS): EmbeddingResult {
  const tokens = tokenize(text);
  const vector = new Array<number>(dimensions).fill(0);

  if (!tokens.length) {
    return { model: DEFAULT_MODEL, vector };
  }

  for (const token of tokens) {
    const hash = hashToken(token);
    const bucket = hash.readUInt32BE(0) % dimensions;
    const sign = (hash[4] & 1) === 0 ? 1 : -1;
    const weight = 1 + (hash[5] / 255);
    vector[bucket] += sign * weight;
  }

  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (norm > 0) {
    for (let index = 0; index < vector.length; index += 1) {
      vector[index] = Number((vector[index] / norm).toFixed(8));
    }
  }

  return {
    model: DEFAULT_MODEL,
    vector,
  };
}

export function parseEmbedding(value: unknown): number[] | null {
  if (!Array.isArray(value)) return null;
  const vector = value
    .map((entry) => (typeof entry === 'number' ? entry : Number(entry)))
    .filter((entry) => Number.isFinite(entry));

  return vector.length ? vector : null;
}

export function cosineSimilarity(a: number[] | null, b: number[] | null): number {
  if (!a || !b || a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let index = 0; index < a.length; index += 1) {
    const aValue = a[index];
    const bValue = b[index];
    dot += aValue * bValue;
    normA += aValue * aValue;
    normB += bValue * bValue;
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
