const STOP_WORDS = new Set([
  // German stop words
  'und',
  'oder',
  'aber',
  'der',
  'die',
  'das',
  'ein',
  'eine',
  'einer',
  'eines',
  'ist',
  'sind',
  'war',
  'waren',
  'mit',
  'auf',
  'für',
  'aus',
  'den',
  'dem',
  'des',
  'im',
  'in',
  'am',
  'an',
  'als',
  'auch',
  'bei',
  'vom',
  'von',
  'nicht',
  'nur',
  'schon',
  'wie',
  'wir',
  'ihr',
  'sie',
  'er',
  'es',
  'zu',
  'zur',
  'zum',
  'nach',
  // English stop words (mixed language content)
  'the',
  'this',
  'that',
  'these',
  'those',
  'and',
  'or',
  'but',
  'with',
  'without',
  'into',
  'from',
  'where',
  'how',
  'what',
  'which',
  'your',
  'their',
  'our',
  'you',
]);

const ACCENT_MARKS_REGEX = /[\u0300-\u036f]/g;

type WeightVector = Map<string, number>;

interface VectorRepresentation {
  weights: WeightVector;
  norm: number;
}

export interface SemanticDocument<TPayload> {
  id: string;
  text: string;
  payload: TPayload;
  boost?: number;
}

export interface VectorSearchOptions {
  topK?: number;
  minScore?: number;
}

export interface VectorSearchResult<TPayload> {
  id: string;
  score: number;
  payload: TPayload;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(ACCENT_MARKS_REGEX, '')
    .split(/[^a-z0-9äöüß]+/i)
    .map((token) => token.trim())
    .filter(
      (token) =>
        token.length > 2 &&
        !STOP_WORDS.has(token) &&
        Number.isNaN(Number(token)) // drop pure numbers
    );
}

function buildTermFrequency(tokens: string[]): WeightVector {
  const tf = new Map<string, number>();
  if (!tokens.length) {
    return tf;
  }

  const totalTokens = tokens.length;
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }

  tf.forEach((count, term) => {
    tf.set(term, count / totalTokens);
  });

  return tf;
}

function computeIdf(documents: string[][]): WeightVector {
  const docFreq = new Map<string, number>();

  for (const tokens of documents) {
    const seen = new Set(tokens);
    for (const token of seen) {
      docFreq.set(token, (docFreq.get(token) || 0) + 1);
    }
  }

  const docCount = documents.length || 1;
  const idf = new Map<string, number>();

  docFreq.forEach((count, term) => {
    // Smooth IDF to avoid zero division.
    const weight = Math.log((docCount + 1) / (count + 1)) + 1;
    idf.set(term, weight);
  });

  return idf;
}

function buildVector(tokens: string[], idf: WeightVector, boost = 1): VectorRepresentation {
  const tf = buildTermFrequency(tokens);
  let normSq = 0;

  tf.forEach((tfWeight, term) => {
    const idfWeight = idf.get(term);
    if (!idfWeight) return;
    const weight = tfWeight * idfWeight * boost;
    tf.set(term, weight);
    normSq += weight * weight;
  });

  return {
    weights: tf,
    norm: Math.sqrt(normSq),
  };
}

function cosineSimilarity(a: VectorRepresentation, b: VectorRepresentation): number {
  if (a.norm === 0 || b.norm === 0) return 0;

  let dot = 0;
  const [small, large] = a.weights.size < b.weights.size ? [a, b] : [b, a];
  small.weights.forEach((weight, term) => {
    const otherWeight = large.weights.get(term);
    if (otherWeight) {
      dot += weight * otherWeight;
    }
  });

  return dot / (a.norm * b.norm);
}

export function semanticVectorSearch<TPayload>(
  query: string,
  documents: SemanticDocument<TPayload>[],
  options: VectorSearchOptions = {}
): VectorSearchResult<TPayload>[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery || !documents.length) {
    return [];
  }

  const tokenizedDocs = documents.map((doc) => tokenize(doc.text));
  const idf = computeIdf(tokenizedDocs);
  const documentVectors = tokenizedDocs.map((tokens, index) =>
    buildVector(tokens, idf, documents[index]?.boost ?? 1)
  );
  const queryVector = buildVector(tokenize(trimmedQuery), idf);

  if (queryVector.norm === 0) {
    return [];
  }

  const { topK = 6, minScore = 0.05 } = options;
  const scored = documentVectors
    .map((vector, index) => ({
      id: documents[index].id,
      score: cosineSimilarity(queryVector, vector),
      payload: documents[index].payload,
    }))
    .filter((result) => result.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored;
}

