'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

// Optional PayPal imports - falls Paket nicht installiert ist
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let PayPalButtons: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let usePayPalScriptReducer: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const paypalModule = require('@paypal/react-paypal-js');
  PayPalButtons = paypalModule.PayPalButtons;
  usePayPalScriptReducer = paypalModule.usePayPalScriptReducer;
} catch {
  // PayPal SDK nicht installiert
  console.warn('PayPal SDK nicht installiert. PayPal-Funktionalität ist nicht verfügbar.');
}

interface PayPalCheckoutButtonProps {
  orderId: string;
  total: number;
  currency?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// Inner component that uses PayPal hooks - only rendered when SDK is available
function PayPalButtonInner({
  orderId,
  total,
  currency,
  onSuccess,
  onError,
}: PayPalCheckoutButtonProps) {
  const router = useRouter();
  const locale = useLocale();
  const [{ isPending }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);

  // Create PayPal order
  const createOrder = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          total,
          currency,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create PayPal order');
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onError?.(errorMessage);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle PayPal approval
  const onApprove = async (data: { orderID: string }) => {
    try {
      setIsProcessing(true);
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paypalOrderId: data.orderID,
          orderId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to capture PayPal order');
      }

      const result = await response.json();

      if (result.success && result.paymentStatus === 'PAID') {
        // Payment successful
        onSuccess?.();
        router.push(`/${locale}/orders/${orderId}?payment=success`);
      } else {
        throw new Error(result.message || 'Payment not completed');
      }
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle PayPal errors
  const onPayPalError = (err: Record<string, unknown>) => {
    console.error('PayPal error:', err);
    onError?.('PayPal payment error occurred');
  };

  // Handle cancellation
  const onCancel = () => {
    console.log('PayPal payment cancelled');
    onError?.('Payment was cancelled');
  };

  if (isPending || isProcessing) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">
            {isPending ? 'PayPal wird geladen...' : 'Zahlung wird verarbeitet...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onPayPalError}
      onCancel={onCancel}
      style={{
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
      }}
    />
  );
}

export function PayPalCheckoutButton(props: PayPalCheckoutButtonProps) {
  // Check if PayPal SDK is available before rendering inner component
  if (!PayPalButtons || !usePayPalScriptReducer) {
    return (
      <div className="flex items-center justify-center p-4 border border-yellow-500 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
        <div className="text-center">
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
            PayPal SDK nicht installiert
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            Bitte installieren Sie die PayPal-Pakete: npm install @paypal/react-paypal-js @paypal/paypal-server-sdk
          </p>
        </div>
      </div>
    );
  }

  return <PayPalButtonInner {...props} />;
}

