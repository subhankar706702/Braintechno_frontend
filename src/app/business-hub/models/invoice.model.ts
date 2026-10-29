export type InvoicePaymentMethod = 'cash' | 'upi' | 'card' | 'bank-transfer' | 'other';
export interface InvoiceProductOption { id: string; name: string; description?: string; sku?: string; originalPrice: number; discountPrice: number; gstEnabled: boolean; gstRate: number; quantity: number; unit: string; }
export interface InvoiceLine { stockItemId: string; name: string; description: string; sku: string; quantity: number; unit: string; unitPrice: number; discountPercent: number; gstEnabled: boolean; gstRate: number; }
export interface InvoiceCustomer { name: string; mobile: string; email?: string; address?: string; gstin?: string; }
export interface InvoiceDraftPayload { customer: InvoiceCustomer; items: InvoiceLine[]; paymentAmount: number; paymentMethod: InvoicePaymentMethod; notes?: string; idempotencyKey: string; }
export interface InvoiceCalculation { subtotal: number; discountTotal: number; taxableAmount: number; gstTotal: number; total: number; paidAmount: number; dueAmount: number; }
export interface InvoicePreviewResponse { calculation: InvoiceCalculation; }
export interface FinalizedInvoiceResponse { id: string; invoiceNumber: string; invoiceDate: string; customer: InvoiceCustomer; items: InvoiceLine[]; calculation: InvoiceCalculation; paymentMethod: InvoicePaymentMethod; dueRecordId?: string; }
