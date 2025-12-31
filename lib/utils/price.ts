/**
 * Formats a price value with the given currency using German locale formatting
 * @param value - The price value to format
 * @param currency - The currency code (e.g., 'EUR', 'USD'). Defaults to 'EUR'
 * @returns Formatted price string (e.g., "1.234,56 €" for EUR)
 */
export function formatPrice(value: number, currency: string | boolean | undefined = 'EUR'): string {
  // Ensure currency is a valid string
  let validCurrency = 'EUR';
  if (typeof currency === 'string' && currency.length === 3) {
    validCurrency = currency.toUpperCase();
  } else if (currency === true || currency === false) {
    // Handle boolean values (fallback to EUR)
    validCurrency = 'EUR';
  }
  
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: validCurrency,
    minimumFractionDigits: 2,
  }).format(value);
}

