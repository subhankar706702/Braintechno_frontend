import type { InvoiceSettings } from '../../models/invoice-settings.service';

export interface InvoicePdfItem {
  name: string;
  description?: string;
  sku?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent?: number;
  lineSubtotal?: number;
  lineDiscount?: number;
  lineTax?: number;
  lineTotal?: number;
  gstRate?: number;
}

export interface InvoicePdfData {
  id: string;
  invoiceNumber: string;
  invoiceDate?: string | Date;
  customer: {
    name?: string;
    mobile?: string;
    email?: string;
    address?: string;
    gstin?: string;
  };
  items: InvoicePdfItem[];
  calculation: {
    subtotal: number;
    discountTotal: number;
    taxableAmount: number;
    gstTotal: number;
    roundOff: number;
    total: number;
    paidAmount: number;
    dueAmount: number;
  };
  paymentMethod: string;
  notes?: string;
}

export type InvoicePdfSettings = InvoiceSettings & {
  signatureDataUrl?: string;
  sealDataUrl?: string;
};

export interface InvoicePdfContext {
  readonly invoice: InvoicePdfData;
  readonly settings: InvoicePdfSettings;
  readonly businessLogo: string;
  readonly footerText: string;
  readonly poweredByText: string;
}
