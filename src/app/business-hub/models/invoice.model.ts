export type InvoicePaymentMethod =
  | 'Cash'
  | 'UPI'
  | 'Card'
  | 'Bank Transfer'
  | 'Other'
  | 'cash'
  | 'upi'
  | 'card'
  | 'bank-transfer'
  | 'other';

export interface InvoiceProductOption {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  originalPrice: number;
  discountPrice: number;
  gstEnabled: boolean;
  gstRate: number;
  quantity: number;
  unit: string;
}

export interface InvoiceLine {
  itemType?: 'stock' | 'custom';
  stockItemId?: string;
  name: string;
  description: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent: number;
  gstEnabled: boolean;
  gstRate: number;
}

export interface InvoiceCustomer {
  name: string;
  mobile: string;
  email?: string;
  address?: string;
  gstin?: string;
}

export interface InvoiceDraftPayload {
  customer: InvoiceCustomer;
  items: InvoiceLine[];
  paymentAmount: number;
  paymentMethod: InvoicePaymentMethod;
  notes?: string;
  idempotencyKey: string;
  invoiceNumberSettings?: {
    prefix: string;
    startNumber: number;
    padding: number;
  };
}

export interface InvoiceCalculation {
  subtotal: number;
  discountTotal: number;
  taxableAmount: number;
  gstTotal: number;
  roundOff: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
}

export interface InvoicePreviewResponse {
  items?: Array<InvoiceLine & {
    lineSubtotal?: number;
    lineDiscount?: number;
    lineTax?: number;
    lineTotal?: number;
    availableQuantity?: number;
  }>;
  calculation: InvoiceCalculation;
}

export interface FinalizedInvoiceResponse {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  customer: InvoiceCustomer;
  items: Array<InvoiceLine & {
    lineSubtotal?: number;
    lineDiscount?: number;
    lineTax?: number;
    lineTotal?: number;
  }>;
  calculation: InvoiceCalculation;
  paymentMethod: InvoicePaymentMethod;
  notes?: string;
  dueRecordId?: string;
  customerId?: string;
  persisted?: boolean;
  reused?: boolean;
  pdfUrl?: string;
}