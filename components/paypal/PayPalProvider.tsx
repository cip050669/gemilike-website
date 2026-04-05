'use client';

// Optional PayPal import - falls Paket nicht installiert ist
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let PayPalScriptProvider: any = null;
try {
  const paypalModule = require('@paypal/react-paypal-js');
  PayPalScriptProvider = paypalModule.PayPalScriptProvider;
} catch {
  // PayPal SDK nicht installiert - Provider wird übersprungen
  console.warn('PayPal SDK nicht installiert. PayPal-Funktionalität ist nicht verfügbar.');
}

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

const initialOptions = {
  clientId: PAYPAL_CLIENT_ID,
  currency: 'EUR',
  intent: 'capture',
  locale: 'de_DE',
};

export function PayPalProvider({ children }: { children: React.ReactNode }) {
  // Only render PayPal provider if SDK is available and client ID is configured
  if (!PayPalScriptProvider || !PAYPAL_CLIENT_ID) {
    return <>{children}</>;
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
}

