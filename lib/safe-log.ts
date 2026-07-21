/**
 * Strip control characters that enable log forging / log injection.
 */
export function sanitizeForLog(value: unknown, maxLength = 500): string {
  let text: string;
  if (typeof value === 'string') {
    text = value;
  } else if (value instanceof Error) {
    text = value.message;
  } else {
    try {
      text = JSON.stringify(value);
    } catch {
      text = String(value);
    }
  }

  return text
    .replace(/[\r\n\u0000\u2028\u2029]/g, ' ')
    .slice(0, maxLength);
}
