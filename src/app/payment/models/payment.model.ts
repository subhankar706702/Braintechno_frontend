export type PaymentType = 'subscription';
export type PaymentBillingCycle = 'monthly' | 'halfYearly' | 'yearly' | 'custom';
export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed' | 'cancelled' | 'refunded';

export interface PaymentRequest {
  plan: 'basic' | 'premium' | 'custom';
  billingCycle: PaymentBillingCycle;
  metadata?: Record<string, unknown>;
}

export interface PaymentRecord {
  paymentId: string;
  businessId: string;
  accountId: string;
  plan: 'basic' | 'premium' | 'custom';
  billingCycle: PaymentBillingCycle;
  amount: number;
  priceSnapshot: number;
  currency: string;
  status: PaymentStatus;
  gateway: string | null;
  gatewayOrderId: string | null;
  gatewayPaymentId: string | null;
  gatewaySignature: string | null;
  failureReason: string | null;
  metadata: Record<string, unknown>;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentResult {
  payment: PaymentRecord;
}
