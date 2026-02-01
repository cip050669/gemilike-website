export type ComparisonOperator = '>' | '>=' | '<' | '<=' | '=';

export interface NumericFilter {
  field: string;
  operator: ComparisonOperator;
  value: number;
}

export interface BooleanGroup {
  terms: string[];
  filters: NumericFilter[];
}

export interface ParsedVectorQuery {
  groups: BooleanGroup[];
  vectorText: string;
}

const LOGIC_SPLIT_OR = /\s+\bOR\b\s+/i;
const LOGIC_SPLIT_AND = /\s+\bAND\b\s+/i;
const COMPARATOR_REGEX =
  /^([a-zA-Z][\w-]*)\s*(<=|>=|=|<|>)\s*([-+]?\d+(?:[.,]\d+)?)(?:\s*[a-zA-Z%°€$£¥]+)?$/i;
const COMPARATOR_NO_FIELD_REGEX =
  /^(<=|>=|=|<|>)\s*([-+]?\d+(?:[.,]\d+)?)(?:\s*[a-zA-Z%°€$£¥]+)?$/i;
const HAS_LOGIC_REGEX = /\b(AND|OR)\b/i;
const HAS_COMPARATOR_REGEX = /[a-zA-Z][\w-]*\s*(?:<=|>=|=|<|>)\s*[-+]?\d+(?:[.,]\d+)?/i;
const TERM_STOP_WORDS = new Set([
  'and',
  'or',
  'und',
  'oder',
  'farbe',
  'color',
  'gewicht',
  'weight',
  'herkunft',
  'origin',
  'ct',
  'gramm',
  'gram',
  'g',
]);

const normalizeNumber = (value: string) => Number(value.replace(',', '.'));

/** Max input length to mitigate ReDoS / DoS from complex or very long queries */
const MAX_QUERY_INPUT_LENGTH = 2000;

export function parseVectorQuery(input: string): ParsedVectorQuery {
  const trimmed = input.trim().slice(0, MAX_QUERY_INPUT_LENGTH);
  if (!trimmed) {
    return { groups: [], vectorText: '' };
  }

  // Prüfe zuerst, ob es numerische Filter gibt
  const hasComparator = HAS_COMPARATOR_REGEX.test(trimmed);
  
  // Normalisiere Connectors
  // WICHTIG: "und" zwischen Text-Terms wird als OR behandelt (z.B. "brasilien und tansania" = brasilien OR tansania)
  // "und" wird nur bei numerischen Filtern als AND behandelt (z.B. "brasilien und preis >100" = brasilien AND preis >100)
  let normalizedConnectors: string;
  
  if (hasComparator) {
    // Wenn numerische Filter vorhanden sind, behalte AND für "und"
    normalizedConnectors = trimmed
      .replace(/\bund\b/gi, ' AND ')
      .replace(/\border\b/gi, ' OR ')
      .replace(/\band\b/gi, ' AND ')
      .replace(/\bor\b/gi, ' OR ')
      .replace(/\s+/g, ' ')
      .trim();
  } else {
    // Für reine Text-Terms: "und" bedeutet OR (zeigt Steine mit EINER der Herkünfte)
    normalizedConnectors = trimmed
      .replace(/\s+und\s+/gi, ' OR ')
      .replace(/\s+oder\s+/gi, ' OR ')
      .replace(/\s+and\s+/gi, ' OR ')
      .replace(/\s+or\s+/gi, ' OR ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const hasLogic = HAS_LOGIC_REGEX.test(normalizedConnectors);

  const orParts = hasLogic
    ? normalizedConnectors.split(LOGIC_SPLIT_OR).map((part) => part.trim()).filter(Boolean)
    : [normalizedConnectors];
  const allTerms: string[] = [];
  const groups: BooleanGroup[] = [];

  for (const orPart of orParts) {
    const andParts = hasLogic
      ? orPart.split(LOGIC_SPLIT_AND).map((part) => part.trim()).filter(Boolean)
      : [orPart];
    const group: BooleanGroup = { terms: [], filters: [] };
    let lastField: string | null = null;

    for (const node of andParts) {
      const comparatorMatch = node.match(COMPARATOR_REGEX);
      if (comparatorMatch) {
        const [, field, operator, rawValue] = comparatorMatch;
        const value = normalizeNumber(rawValue);
        if (!Number.isNaN(value)) {
          group.filters.push({
            field: field.toLowerCase(),
            operator: operator as ComparisonOperator,
            value,
          });
        }
        lastField = field.toLowerCase();
        continue;
      }

      const comparatorNoField = node.match(COMPARATOR_NO_FIELD_REGEX);
      if (comparatorNoField && lastField) {
        const [, operator, rawValue] = comparatorNoField;
        const value = normalizeNumber(rawValue);
        if (!Number.isNaN(value)) {
          group.filters.push({
            field: lastField,
            operator: operator as ComparisonOperator,
            value,
          });
        }
        continue;
      }

      if (node.length) {
        const tokens = node
          .split(/[\s,]+/)
          .map((token) => token.trim())
          .filter(Boolean);
        for (const token of tokens) {
          const normalizedToken = token.toLowerCase();
          if (TERM_STOP_WORDS.has(normalizedToken)) {
            continue;
          }
          group.terms.push(normalizedToken);
          allTerms.push(normalizedToken);
        }
      }
    }

    if (group.terms.length || group.filters.length) {
      groups.push(group);
    }
  }

  const vectorText = allTerms.join(' ').trim();

  return {
    groups,
    vectorText,
  };
}

export type NumericFieldResolver<TPayload> = (field: string, payload: TPayload) => number | null | undefined;

function compareValues(value: number, operator: ComparisonOperator, expected: number) {
  switch (operator) {
    case '>':
      return value > expected;
    case '>=':
      return value >= expected;
    case '<':
      return value < expected;
    case '<=':
      return value <= expected;
    case '=':
      return value === expected;
    default:
      return false;
  }
}

/** Max document length to mitigate ReDoS when matching terms */
const MAX_DOCUMENT_TEXT_LENGTH = 50_000;

export function evaluateVectorQuery<TPayload>(
  parsed: ParsedVectorQuery,
  documentText: string,
  payload: TPayload,
  resolveField: NumericFieldResolver<TPayload>
) {
  if (!parsed.groups.length) {
    return true;
  }

  const normalizedText = documentText.slice(0, MAX_DOCUMENT_TEXT_LENGTH).toLowerCase();

  // Gruppen werden mit OR kombiniert (wenn mehrere Gruppen vorhanden sind)
  // Innerhalb einer Gruppe: Text-Terms mit OR, numerische Filter mit AND
  return parsed.groups.some((group) => {
    // Text-Terms: Mindestens EINER muss vorkommen (OR-Logik)
    // Dies ermöglicht Suchen wie "brasilien und tansania" -> zeigt Steine aus Brasilien ODER Tansania
    const textMatches =
      group.terms.length === 0 ||
      group.terms.some((term) => {
        const normalizedTerm = term.toLowerCase().trim();
        if (!normalizedTerm) return false;
        
        // Präzise Suche: Exakte Übereinstimmung oder Wortgrenzen
        // Suche nach ganzen Wörtern, nicht Teilstrings
        const words = normalizedText.split(/\s+/);
        const exactMatch = words.some(word => word === normalizedTerm);
        if (exactMatch) return true;
        
        // Für zusammengesetzte Begriffe (z.B. "sri lanka") prüfe auf Teilübereinstimmung
        if (normalizedTerm.includes(' ')) {
          return normalizedText.includes(normalizedTerm);
        }
        
        // Für einzelne Wörter: prüfe auf Wortanfang oder exakte Übereinstimmung
        return words.some(word => 
          word === normalizedTerm || 
          word.startsWith(normalizedTerm) ||
          normalizedText.includes(` ${normalizedTerm} `) ||
          normalizedText.startsWith(`${normalizedTerm} `) ||
          normalizedText.endsWith(` ${normalizedTerm}`)
        );
      });

    if (!textMatches) {
      return false;
    }

    // Alle numerischen Filter müssen erfüllt sein (AND-Logik)
    const filtersMatch = group.filters.every((filter) => {
      const resolved = resolveField(filter.field, payload);
      if (typeof resolved !== 'number' || Number.isNaN(resolved)) {
        return false;
      }
      return compareValues(resolved, filter.operator, filter.value);
    });

    return filtersMatch;
  });
}
