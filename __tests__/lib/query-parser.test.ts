import { evaluateVectorQuery, parseVectorQuery } from '@/lib/search/query-parser';

describe('parseVectorQuery', () => {
  it('maps fieldless carat comparisons to weight filters', () => {
    const parsed = parseVectorQuery('>5 ct');

    expect(parsed.vectorText).toBe('');
    expect(parsed.groups).toEqual([
      {
        terms: [],
        filters: [{ field: 'weight', operator: '>', value: 5 }],
      },
    ]);
  });

  it('maps fieldless gram comparisons to weight filters', () => {
    const parsed = parseVectorQuery('<2 g');

    expect(parsed.groups).toEqual([
      {
        terms: [],
        filters: [{ field: 'weight', operator: '<', value: 2 }],
      },
    ]);
  });

  it('keeps explicit field comparisons unchanged', () => {
    const parsed = parseVectorQuery('gewicht >5 ct');

    expect(parsed.groups).toEqual([
      {
        terms: [],
        filters: [{ field: 'gewicht', operator: '>', value: 5 }],
      },
    ]);
  });

  it('maps "ab 5 ct" to a >= weight filter', () => {
    const parsed = parseVectorQuery('ab 5 ct');

    expect(parsed.groups).toEqual([
      {
        terms: [],
        filters: [{ field: 'weight', operator: '>=', value: 5 }],
      },
    ]);
  });

  it('maps "ueber 5 ct" and "über 5 ct" to a > weight filter', () => {
    expect(parseVectorQuery('ueber 5 ct').groups).toEqual([
      {
        terms: [],
        filters: [{ field: 'weight', operator: '>', value: 5 }],
      },
    ]);

    expect(parseVectorQuery('über 5 ct').groups).toEqual([
      {
        terms: [],
        filters: [{ field: 'weight', operator: '>', value: 5 }],
      },
    ]);
  });

  it('maps "groesser 5 ct" and "größer 5 ct" to a > weight filter', () => {
    expect(parseVectorQuery('groesser 5 ct').groups).toEqual([
      {
        terms: [],
        filters: [{ field: 'weight', operator: '>', value: 5 }],
      },
    ]);

    expect(parseVectorQuery('größer 5 ct').groups).toEqual([
      {
        terms: [],
        filters: [{ field: 'weight', operator: '>', value: 5 }],
      },
    ]);
  });

  it('maps "5+ ct" to a >= weight filter', () => {
    const parsed = parseVectorQuery('5+ ct');

    expect(parsed.groups).toEqual([
      {
        terms: [],
        filters: [{ field: 'weight', operator: '>=', value: 5 }],
      },
    ]);
  });

  it('maps "genau 5 ct" and "exakt 5 ct" to an = weight filter', () => {
    expect(parseVectorQuery('genau 5 ct').groups).toEqual([
      {
        terms: [],
        filters: [{ field: 'weight', operator: '=', value: 5 }],
      },
    ]);

    expect(parseVectorQuery('exakt 5 ct').groups).toEqual([
      {
        terms: [],
        filters: [{ field: 'weight', operator: '=', value: 5 }],
      },
    ]);
  });
});

describe('evaluateVectorQuery', () => {
  it('matches numeric weight filters parsed from unit-only queries', () => {
    const parsed = parseVectorQuery('>5 ct');

    const matches = evaluateVectorQuery(
      parsed,
      'saphir aus sri lanka',
      { weight: 6.2 },
      (field, payload) => (field === 'weight' ? payload.weight : null)
    );

    expect(matches).toBe(true);
  });

  it('rejects payloads below the parsed threshold', () => {
    const parsed = parseVectorQuery('>5 ct');

    const matches = evaluateVectorQuery(
      parsed,
      'saphir aus sri lanka',
      { weight: 4.9 },
      (field, payload) => (field === 'weight' ? payload.weight : null)
    );

    expect(matches).toBe(false);
  });

  it('supports natural-language weight filters combined with text terms', () => {
    const parsed = parseVectorQuery('saphir und ab 5 ct');

    const matches = evaluateVectorQuery(
      parsed,
      'blauer saphir aus sri lanka',
      { weight: 5.1 },
      (field, payload) => (field === 'weight' ? payload.weight : null)
    );

    expect(matches).toBe(true);
  });

  it('supports natural-language equality filters', () => {
    const parsed = parseVectorQuery('genau 5 ct');

    expect(
      evaluateVectorQuery(
        parsed,
        'blauer saphir',
        { weight: 5 },
        (field, payload) => (field === 'weight' ? payload.weight : null)
      )
    ).toBe(true);

    expect(
      evaluateVectorQuery(
        parsed,
        'blauer saphir',
        { weight: 5.1 },
        (field, payload) => (field === 'weight' ? payload.weight : null)
      )
    ).toBe(false);
  });
});
