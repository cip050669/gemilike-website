import { semanticVectorSearch } from '@/lib/search/vector-search';

const DOCUMENTS = [
  {
    id: '1',
    text: 'Pflege von Diamanten und Reinigungstipps für Edelsteine.',
    payload: { slug: 'diamant-pflege' },
  },
  {
    id: '2',
    text: 'Investment-Strategien für Rubine, Saphire und Smaragde.',
    payload: { slug: 'investment' },
  },
  {
    id: '3',
    text: 'GIA Zertifikate verstehen: Was steht auf dem Zertifikat?',
    payload: { slug: 'gia-zertifikat' },
  },
];

describe('semanticVectorSearch', () => {
  it('ranks the most relevant document first', () => {
    const results = semanticVectorSearch('Wie reinige ich meinen Diamanten?', DOCUMENTS, {
      minScore: 0.01,
      topK: 3,
    });

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('1');
  });

  it('filters out low scoring results', () => {
    const results = semanticVectorSearch('Rubin Investment', DOCUMENTS, {
      minScore: 0.02,
      topK: 3,
    });

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('2');
    expect(results[0].score).toBeGreaterThan(0.02);
  });

  it('returns an empty array for empty queries', () => {
    expect(semanticVectorSearch('', DOCUMENTS)).toEqual([]);
  });
});

