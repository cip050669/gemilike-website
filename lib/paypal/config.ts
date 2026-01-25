/**
 * PayPal Configuration
 * 
 * This file handles PayPal API configuration for both client and server-side operations.
 */

// PayPal Client ID (public, safe to expose in frontend)
export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

// PayPal Client Secret (server-side only)
export const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';

// PayPal Environment (sandbox or live)
export const PAYPAL_ENVIRONMENT = process.env.PAYPAL_ENVIRONMENT || 'sandbox';

// PayPal API Base URL
export const PAYPAL_API_BASE_URL = 
  PAYPAL_ENVIRONMENT === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

// Check if PayPal is configured
export const isPayPalConfigured = (): boolean => {
  return !!(PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET);
};

// Get PayPal SDK configuration for server-side
export const getPayPalSDKConfig = () => {
  if (!isPayPalConfigured()) {
    throw new Error('PayPal is not configured. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables.');
  }

  return {
    clientId: PAYPAL_CLIENT_ID,
    clientSecret: PAYPAL_CLIENT_SECRET,
    environment: PAYPAL_ENVIRONMENT === 'live' ? 'production' : 'sandbox',
  };
};


