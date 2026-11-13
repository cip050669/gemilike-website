/**
 * Strip control characters that enable log forging / log injection.
 * Rebuilds a printable ASCII string so taint analysis cannot treat the
 * result as still user-controlled newline-bearing input.
 */
export function sanitizeForLog(value: unknown, maxLength = 500): string {
  let text: string;
  if (typeof value === 'string') {
    text = value;
  } else if (value instanceof Error) {
    text = value.message;
  } else if (typeof value === 'number' || typeof value === 'boolean') {
    text = String(value);
  } else {
    try {
      text = JSON.stringify(value);
    } catch {
      text = Object.prototype.toString.call(value);
    }
  }

  let out = '';
  for (let i = 0; i < text.length && out.length < maxLength; i += 1) {
    const code = text.charCodeAt(i);
    if (code >= 0x20 && code <= 0x7e) {
      out += text[i];
    } else {
      out += ' ';
    }
  }
  return out;
}

/** Log errors without echoing potentially tainted messages. */
export function logSafeError(prefix: string, error: unknown): void {
  const name = error instanceof Error ? error.name : 'UnknownError';
  console.error(prefix, name);
}
