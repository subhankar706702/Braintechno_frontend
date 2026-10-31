
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import {
  MyStockApiService,
  StockItem,
} from '../../core/my-stock-api.service';
import { API_BASE_URL } from '../../core/api.config';

interface InvoiceLine {
  stockItemId: string;
  name: string;
  description: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent: number;
  gstEnabled: boolean;
  gstRate: number;
  availableQuantity: number;
}

interface InvoiceCustomer {
  name: string;
  mobile: string;
  email: string;
  address: string;
  gstin: string;
}

interface FinalizedInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate?: string | Date;
  customer: Partial<InvoiceCustomer>;
  items: Array<{
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
  }>;
  calculation: {
    subtotal: number;
    discountTotal: number;
    taxableAmount: number;
    gstTotal: number;
    total: number;
    paidAmount: number;
    dueAmount: number;
  };
  paymentMethod: string;
  notes?: string;
}

@Component({
  selector: 'app-invoice-generator-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-generator.page.html',
  styleUrl: './invoice-generator.page.scss',
})
export class InvoiceGeneratorPage implements OnInit {
  private readonly invoiceEndpoint =
    `${API_BASE_URL}/business-hub/invoices`;

  readonly stockItems = signal<StockItem[]>([]);
  readonly loadingStock = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly lastInvoiceId = signal('');
  readonly lastInvoice = signal<FinalizedInvoice | null>(null);
  readonly printingInvoice = signal(false);
  readonly generatingPdf = signal(false);
  readonly sharingPdf = signal(false);
  readonly previewMode = signal(false);

  readonly items = signal<InvoiceLine[]>([]);

  readonly subtotal = computed(() =>
    this.items().reduce(
      (sum, item) => sum + this.lineSubtotal(item),
      0,
    ),
  );

  readonly discountTotal = computed(() =>
    this.items().reduce(
      (sum, item) =>
        sum +
        this.lineSubtotal(item) *
          this.clamp(item.discountPercent, 0, 100) /
          100,
      0,
    ),
  );

  readonly taxableAmount = computed(() =>
    Math.max(0, this.subtotal() - this.discountTotal()),
  );

  readonly gstTotal = computed(() =>
    this.items().reduce((sum, item) => {
      const base =
        this.lineSubtotal(item) *
        (1 - this.clamp(item.discountPercent, 0, 100) / 100);

      return sum +
        (item.gstEnabled
          ? base * this.clamp(item.gstRate, 0, 100) / 100
          : 0);
    }, 0),
  );

  readonly grandTotal = computed(() =>
    this.roundMoney(this.taxableAmount() + this.gstTotal()),
  );

  readonly paidAmount = signal(0);

  readonly dueAmount = computed(() =>
    this.roundMoney(
      Math.max(0, this.grandTotal() - this.paidAmount()),
    ),
  );

  customer: InvoiceCustomer = this.emptyCustomer();
  private idempotencyKey = '';
  private idempotencyFingerprint = '';
  paymentMethod = 'Cash';
  notes = '';

  readonly paymentMethods = [
    'Cash',
    'UPI',
    'Card',
    'Bank Transfer',
    'Other',
  ];

  constructor(
    private readonly stockApi: MyStockApiService,
    private readonly http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.loadStock();
  }

  private emptyCustomer(): InvoiceCustomer {
    return {
      name: '',
      mobile: '',
      email: '',
      address: '',
      gstin: '',
    };
  }

  loadStock(): void {
    this.loadingStock.set(true);
    this.error.set('');

    this.stockApi
      .list('', 'all')
      .pipe(finalize(() => this.loadingStock.set(false)))
      .subscribe({
        next: result => {
          this.stockItems.set(result.items ?? []);
        },
        error: err => {
          this.error.set(
            err?.error?.message ||
              'Could not load stock products. Please try again.',
          );
        },
      });
  }

  addProduct(stockId: string): void {
    if (!stockId) {
      return;
    }

    const product = this.stockItems().find(
      item => item.id === stockId,
    );

    if (!product) {
      this.error.set('Selected product was not found.');
      return;
    }

    if (product.quantity <= 0) {
      this.error.set(`${product.name} is out of stock.`);
      return;
    }

    const existing = this.items().find(
      item => item.stockItemId === product.id,
    );

    if (existing) {
      if (existing.quantity >= product.quantity) {
        this.error.set(
          `Only ${product.quantity} ${product.unit} available for ${product.name}.`,
        );
        return;
      }

      this.items.update(lines =>
        lines.map(item =>
          item.stockItemId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );

      this.error.set('');
      this.previewMode.set(false);
      return;
    }

    const line: InvoiceLine = {
      stockItemId: product.id,
      name: product.name,
      description: product.description ?? '',
      sku: product.sku ?? '',
      quantity: 1,
      unit: product.unit,
      unitPrice: Number(product.discountPrice) || 0,
      discountPercent: 0,
      gstEnabled: Boolean(product.gstEnabled),
      gstRate: Number(product.gstRate) || 0,
      availableQuantity: Number(product.quantity) || 0,
    };

    this.items.update(lines => [...lines, line]);
    this.idempotencyKey = this.createIdempotencyKey();
    this.error.set('');
    this.previewMode.set(false);
  }

  updateLine(
    index: number,
    field: 'quantity' | 'unitPrice' | 'discountPercent',
    value: number,
  ): void {
    const lines = [...this.items()];
    const item = lines[index];

    if (!item) {
      return;
    }

    if (field === 'quantity') {
      item.quantity = Math.floor(
        this.clamp(value, 1, item.availableQuantity),
      );
    } else if (field === 'unitPrice') {
      item.unitPrice = this.roundMoney(
        this.clamp(value, 0, 100000000000),
      );
    } else {
      item.discountPercent = this.roundMoney(
        this.clamp(value, 0, 100),
      );
    }

    lines[index] = { ...item };
    this.items.set(lines);
    this.idempotencyKey = this.createIdempotencyKey();
    this.previewMode.set(false);
    this.error.set('');
  }

  removeLine(index: number): void {
    this.items.update(lines =>
      lines.filter((_, lineIndex) => lineIndex !== index),
    );
    this.idempotencyKey = this.createIdempotencyKey();

    this.previewMode.set(false);
    this.error.set('');
  }

  lineSubtotal(item: InvoiceLine): number {
    return this.roundMoney(
      Math.max(0, Number(item.quantity) || 0) *
        Math.max(0, Number(item.unitPrice) || 0),
    );
  }

  lineDiscount(item: InvoiceLine): number {
    return this.roundMoney(
      this.lineSubtotal(item) *
        this.clamp(item.discountPercent, 0, 100) /
        100,
    );
  }

  lineTax(item: InvoiceLine): number {
    if (!item.gstEnabled) {
      return 0;
    }

    const taxable =
      this.lineSubtotal(item) - this.lineDiscount(item);

    return this.roundMoney(
      taxable * this.clamp(item.gstRate, 0, 100) / 100,
    );
  }

  setPaidAmount(value: number): void {
    this.paidAmount.set(
      this.roundMoney(
        this.clamp(value, 0, this.grandTotal()),
      ),
    );
  }

  previewInvoice(): void {
    this.error.set('');
    this.success.set('');

    const validation = this.validateInvoice();

    if (validation) {
      this.error.set(validation);
      return;
    }

    this.previewMode.set(true);
  }

  finalizeInvoice(): void {
    this.error.set('');
    this.success.set('');

    const validation = this.validateInvoice();

    if (validation) {
      this.error.set(validation);
      return;
    }

    if (this.saving()) {
      return;
    }

    const payload = {
      customer: {
        name: this.customer.name.trim(),
        mobile: this.customer.mobile.trim(),
        email: this.customer.email.trim(),
        address: this.customer.address.trim(),
        gstin: this.customer.gstin.trim(),
      },
      items: this.items().map(item => ({
        stockItemId: item.stockItemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discountPercent: item.discountPercent,
      })),
      paymentAmount: this.paidAmount(),
      paymentMethod: this.paymentMethod,
      notes: this.notes.trim(),
    };

    const fingerprint = JSON.stringify(payload);
    if (fingerprint !== this.idempotencyFingerprint) {
      this.idempotencyKey = this.createIdempotencyKey();
      this.idempotencyFingerprint = fingerprint;
    }
    const requestPayload = { ...payload, idempotencyKey: this.idempotencyKey };

    this.saving.set(true);

    this.http
      .post<FinalizedInvoice>(`${this.invoiceEndpoint}/finalize`, requestPayload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: result => {
          this.success.set(
            `Invoice ${result.invoiceNumber} created successfully.`,
          );
          this.lastInvoiceId.set(result.id ?? '');
          this.lastInvoice.set(result);

          this.previewMode.set(false);
          this.items.set([]);
          this.customer = this.emptyCustomer();
          this.paidAmount.set(0);
          this.notes = '';
          this.paymentMethod = 'Cash';
          this.idempotencyKey = '';
          this.idempotencyFingerprint = '';
          this.loadStock();

        },
        error: err => {
          this.error.set(
            err?.error?.message ||
              'Invoice could not be finalized. Please try again.',
          );
        },
      });
  }

  openInvoiceForPrint(): void {
    const invoiceId = this.lastInvoiceId();

    if (!invoiceId || this.printingInvoice()) {
      return;
    }

    // Open the window synchronously from the click so popup blockers do not
    // block it while the authenticated HTTP request is in flight.
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      this.error.set('Your browser blocked the print window. Allow pop-ups and try again.');
      return;
    }

    printWindow.document.write(
      '<!doctype html><html><head><title>Loading invoice…</title></head><body>Loading invoice…</body></html>',
    );
    printWindow.document.close();

    this.error.set('');
    this.printingInvoice.set(true);

    this.http
      .get(`${this.invoiceEndpoint}/${encodeURIComponent(invoiceId)}/print`, {
        responseType: 'text',
      })
      .pipe(finalize(() => this.printingInvoice.set(false)))
      .subscribe({
        next: html => {
          printWindow.document.open();
          printWindow.document.write(html);
          printWindow.document.close();
          printWindow.focus();
        },
        error: err => {
          printWindow.close();
          this.error.set(
            err?.error?.message ||
              'Could not open the invoice for printing. Please try again.',
          );
        },
      });
  }

  downloadInvoicePdf(): void {
    const invoice = this.lastInvoice();
    if (!invoice || this.generatingPdf()) return;

    this.generatingPdf.set(true);
    try {
      const pdf = this.createInvoicePdf(invoice);
      pdf.save(`${this.safeFilename(invoice.invoiceNumber)}.pdf`);
      this.success.set(`PDF downloaded for ${invoice.invoiceNumber}.`);
      this.error.set('');
    } catch (error) {
      console.error('Invoice PDF generation failed:', error);
      this.error.set('Could not generate the invoice PDF. Please try again.');
    } finally {
      this.generatingPdf.set(false);
    }
  }

  async shareInvoicePdf(): Promise<void> {
    const invoice = this.lastInvoice();
    if (!invoice || this.sharingPdf()) return;

    this.sharingPdf.set(true);
    this.error.set('');
    try {
      const pdf = this.createInvoicePdf(invoice);
      const blob = pdf.output('blob');
      const file = new File(
        [blob],
        `${this.safeFilename(invoice.invoiceNumber)}.pdf`,
        { type: 'application/pdf' },
      );

      if (typeof navigator !== 'undefined' && 'share' in navigator &&
          typeof navigator.canShare === 'function' &&
          navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Invoice ${invoice.invoiceNumber}`,
          text: `Invoice ${invoice.invoiceNumber} from BRAIN TECHNO`,
        });
        this.success.set(`Invoice ${invoice.invoiceNumber} shared successfully.`);
      } else {
        // Browsers without file sharing can still download the PDF for WhatsApp/email sharing.
        pdf.save(`${this.safeFilename(invoice.invoiceNumber)}.pdf`);
        this.success.set('PDF downloaded. Attach it in WhatsApp, email, or your preferred app to share.');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('Invoice PDF sharing failed:', error);
      this.error.set('Could not share the PDF. Try Download PDF and share the downloaded file.');
    } finally {
      this.sharingPdf.set(false);
    }
  }

  private createInvoicePdf(invoice: FinalizedInvoice): jsPDF {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 14;
    const right = pageWidth - margin;
    let y = 18;

    const rupees = (value: unknown): string =>
      `Rs. ${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const line = (text: string, x = margin, maxWidth = pageWidth - margin * 2): void => {
      const wrapped = pdf.splitTextToSize(text, maxWidth) as string[];
      pdf.text(wrapped, x, y);
      y += wrapped.length * 5;
    };
    const ensureSpace = (height: number): void => {
      if (y + height > pageHeight - 18) {
        pdf.addPage();
        y = 18;
      }
    };

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text('INVOICE', margin, y);
    pdf.setFontSize(12);
    pdf.text('BRAIN TECHNO', right, y, { align: 'right' });
    y += 8;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Invoice No: ${invoice.invoiceNumber}`, margin, y);
    const invoiceDate = invoice.invoiceDate ? new Date(invoice.invoiceDate) : new Date();
    pdf.text(`Date: ${invoiceDate.toLocaleDateString('en-IN')}`, right, y, { align: 'right' });
    y += 9;
    pdf.setDrawColor(210);
    pdf.line(margin, y, right, y);
    y += 8;

    pdf.setFont('helvetica', 'bold');
    line('BILL TO');
    pdf.setFont('helvetica', 'normal');
    line(invoice.customer?.name || 'Walk-in Customer');
    if (invoice.customer?.mobile) line(`Mobile: ${invoice.customer.mobile}`);
    if (invoice.customer?.email) line(`Email: ${invoice.customer.email}`);
    if (invoice.customer?.address) line(`Address: ${invoice.customer.address}`);
    if (invoice.customer?.gstin) line(`GSTIN: ${invoice.customer.gstin}`);
    y += 5;

    const columns = [margin, 88, 108, 128, 148, right];
    const headers = ['Product', 'Qty', 'Price', 'Discount', 'GST', 'Amount'];
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setFillColor(245, 246, 248);
    pdf.rect(margin, y - 4, pageWidth - margin * 2, 9, 'F');
    headers.forEach((header, index) => pdf.text(header, columns[index] + 1, y + 1));
    y += 10;
    pdf.setFont('helvetica', 'normal');

    for (const item of invoice.items ?? []) {
      ensureSpace(14);
      const discount = Number(item.lineDiscount ?? (item.quantity * item.unitPrice * Number(item.discountPercent ?? 0) / 100));
      const tax = Number(item.lineTax ?? 0);
      const total = Number(item.lineTotal ?? (item.quantity * item.unitPrice - discount + tax));
      const productLines = pdf.splitTextToSize(String(item.name || 'Product'), 48) as string[];
      const rowHeight = Math.max(8, productLines.length * 4.5);
      pdf.text(productLines, columns[0] + 1, y);
      pdf.text(`${item.quantity} ${item.unit || ''}`.trim(), columns[1] + 1, y);
      pdf.text(rupees(item.unitPrice), columns[2] + 1, y);
      pdf.text(rupees(discount), columns[3] + 1, y);
      pdf.text(rupees(tax), columns[4] + 1, y);
      pdf.text(rupees(total), right - 1, y, { align: 'right' });
      y += rowHeight;
      pdf.setDrawColor(230);
      pdf.line(margin, y - 2, right, y - 2);
    }

    y += 5;
    const calc = invoice.calculation;
    const totals = [
      ['Subtotal', calc.subtotal],
      ['Discount', -calc.discountTotal],
      ['Taxable amount', calc.taxableAmount],
      ['GST total', calc.gstTotal],
      ['Invoice total', calc.total],
      ['Amount received', calc.paidAmount],
      ['Balance due', calc.dueAmount],
    ];
    for (const [label, value] of totals) {
      ensureSpace(8);
      const isTotal = label === 'Invoice total';
      pdf.setFont('helvetica', isTotal ? 'bold' : 'normal');
      pdf.text(String(label), right - 65, y);
      pdf.text(rupees(value), right, y, { align: 'right' });
      y += isTotal ? 8 : 6;
    }

    ensureSpace(18);
    y += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Payment method: ${invoice.paymentMethod || 'Cash'}`, margin, y);
    if (invoice.notes) {
      y += 7;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Notes:', margin, y);
      y += 5;
      pdf.setFont('helvetica', 'normal');
      line(invoice.notes);
    }
    y += 10;
    pdf.setFontSize(9);
    pdf.text('Thank you for your business.', pageWidth / 2, Math.min(y, pageHeight - 12), { align: 'center' });
    return pdf;
  }

  private safeFilename(value: string): string {
    return String(value || 'invoice').replace(/[^a-z0-9-_]/gi, '_');
  }

  resetInvoice(): void {
    if (this.saving()) {
      return;
    }

    this.customer = this.emptyCustomer();
    this.items.set([]);
    this.paidAmount.set(0);
    this.paymentMethod = 'Cash';
    this.notes = '';
    this.idempotencyKey = '';
    this.idempotencyFingerprint = '';
    this.error.set('');
    this.success.set('');
    this.lastInvoiceId.set('');
    this.lastInvoice.set(null);
    this.previewMode.set(false);
  }

  money(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  }

  private validateInvoice(): string {
    if (!this.items().length) {
      return 'Please add at least one product to the invoice.';
    }

    for (const item of this.items()) {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return `Enter a valid quantity for ${item.name}.`;
      }

      if (item.quantity > item.availableQuantity) {
        return `Only ${item.availableQuantity} ${item.unit} available for ${item.name}.`;
      }

      if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
        return `Enter a valid price for ${item.name}.`;
      }
    }

    if (this.dueAmount() > 0) {
      if (!this.customer.name.trim()) {
        return 'Customer name is required when payment is due.';
      }

      if (!this.customer.mobile.trim()) {
        return 'Customer mobile is required when payment is due.';
      }

      const mobile = this.customer.mobile.replace(/\D/g, '');

      if (mobile.length < 10 || mobile.length > 15) {
        return 'Enter a valid customer mobile number.';
      }
    }

    if (
      !Number.isFinite(this.paidAmount()) ||
      this.paidAmount() < 0 ||
      this.paidAmount() > this.grandTotal()
    ) {
      return 'Paid amount must be between zero and the invoice total.';
    }

    return '';
  }

  private clamp(
    value: number,
    minimum: number,
    maximum: number,
  ): number {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return minimum;
    }

    return Math.min(maximum, Math.max(minimum, number));
  }

  private roundMoney(value: number): number {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  }

  private createIdempotencyKey(): string {
    return [
      Date.now().toString(36),
      Math.random().toString(36).slice(2),
      Math.random().toString(36).slice(2),
    ].join('-');
  }
}
