
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { InvoiceSettingsService } from '../models/invoice-settings.service';
import { jsPDF } from 'jspdf';
import {
  MyStockApiService,
  StockItem,
} from '../../core/my-stock-api.service';

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
    private readonly invoiceSettingsService: InvoiceSettingsService,
  ) { }

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
    if (validation) { this.error.set(validation); return; }
    if (this.saving()) return;

    this.saving.set(true);
    try {
      const now = new Date();
      const sequenceKey = 'brain_techno_invoice_sequence_v1';
      const next = Number(localStorage.getItem(sequenceKey) || 0) + 1;
      localStorage.setItem(sequenceKey, String(next));
      const invoiceNumber = `INV-${now.getFullYear()}-${String(next).padStart(5, '0')}`;
      const invoice: FinalizedInvoice = {
        id: `local-${Date.now()}`,
        invoiceNumber,
        invoiceDate: now,
        customer: { ...this.customer },
        items: this.items().map(item => ({
          name: item.name, description: item.description, sku: item.sku,
          quantity: item.quantity, unit: item.unit, unitPrice: item.unitPrice,
          discountPercent: item.discountPercent,
          lineDiscount: this.lineDiscount(item), lineTax: this.lineTax(item),
          lineTotal: this.roundMoney(this.lineSubtotal(item) - this.lineDiscount(item) + this.lineTax(item)),
          gstRate: item.gstEnabled ? item.gstRate : 0,
        })),
        calculation: {
          subtotal: this.subtotal(), discountTotal: this.discountTotal(),
          taxableAmount: this.taxableAmount(), gstTotal: this.gstTotal(),
          total: this.grandTotal(), paidAmount: this.paidAmount(), dueAmount: this.dueAmount(),
        },
        paymentMethod: this.paymentMethod, notes: this.notes.trim(),
      };
      this.lastInvoice.set(invoice);
      this.lastInvoiceId.set(invoice.id);
      this.success.set(`Invoice ${invoiceNumber} created in this browser. Download or print it now.`);
      this.previewMode.set(false);
      // Invoice creation is local-only. Stock is intentionally not deducted because no backend transaction is used.
    } catch (error) {
      console.error('Local invoice creation failed:', error);
      this.error.set('Could not create the invoice. Please check browser storage and try again.');
    } finally { this.saving.set(false); }
  }

  openInvoiceForPrint(): void {
    const invoice = this.lastInvoice();
    if (!invoice || this.printingInvoice()) return;
    this.printingInvoice.set(true);
    try {
      const pdf = this.createInvoicePdf(invoice);
      pdf.autoPrint();
      const url = pdf.output('bloburl');
      const opened = window.open(url, '_blank');
      if (!opened) this.error.set('Popup blocked. Please allow pop-ups, or use Download PDF.');
      else this.error.set('');
    } catch (error) {
      console.error('Invoice print failed:', error);
      this.error.set('Could not prepare the invoice for printing.');
    } finally { this.printingInvoice.set(false); }
  }

 downloadInvoicePdf(): void {
  const invoice = this.lastInvoice();

  if (!invoice) {
    this.error.set('Please create an invoice before downloading the PDF.');
    return;
  }

  if (this.generatingPdf()) {
    return;
  }

  this.generatingPdf.set(true);
  this.error.set('');
  this.success.set('');

  let objectUrl: string | null = null;

  try {
    const pdf = this.createInvoicePdf(invoice);
    const blob = pdf.output('blob');

    if (!(blob instanceof Blob) || blob.size === 0) {
      throw new Error('PDF file is empty.');
    }

    objectUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `${this.safeFilename(invoice.invoiceNumber)}.pdf`;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.success.set(`PDF download started for ${invoice.invoiceNumber}.`);

    window.setTimeout(() => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }
    }, 60000);

  } catch (error) {
    console.error('Invoice PDF download error:', error);

    this.error.set(
      error instanceof Error
        ? `PDF download failed: ${error.message}`
        : 'PDF download failed. Please try again.'
    );
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
  const settings = this.invoiceSettingsService.get();
  const pdf = new jsPDF({
    unit: 'mm',
    format: settings.pageSize
  });

  const monochrome = settings.printColor === 'bw';
  const hex = settings.primaryColor || '#ff4d6d';
  const rgb = hex.match(/[a-f0-9]{2}/gi)?.map(v => parseInt(v, 16)) ?? [255, 77, 109];

  const accent: [number, number, number] = monochrome
    ? [0, 0, 0]
    : [rgb[0], rgb[1], rgb[2]];

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 14;
  const right = pageWidth - margin;

  let y = 18;

  const rupees = (value: unknown): string =>
    `Rs. ${Number(value || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  const line = (
    text: string,
    x = margin,
    maxWidth = pageWidth - margin * 2
  ): void => {
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

  // Invoice heading
  if (['corporate', 'modern', 'premium'].includes(settings.template)) {
    pdf.setFillColor(...accent);
    pdf.rect(0, 0, pageWidth, 13, 'F');

    pdf.setTextColor(
      monochrome ? 0 : 255,
      monochrome ? 0 : 255,
      monochrome ? 0 : 255
    );

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text('INVOICE', margin, 9);

    y = 24;
  } else {
    pdf.setTextColor(...accent);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text('INVOICE', margin, y);

    y += 10;
  }

  // Business logo: small fixed dimensions
  const logo = settings.logoDataUrl?.trim();
  let logoHeight = 0;

  if (logo) {
    try {
      const logoWidth = 12;
      const logoMaxHeight = 9;

      const imageProperties = pdf.getImageProperties(logo);
      const ratio = imageProperties.width / imageProperties.height;

      const width = Math.min(logoWidth, logoMaxHeight * ratio);
      const height = width / ratio;

      pdf.addImage(
        logo,
        imageProperties.fileType || 'PNG',
        margin,
        y,
        width,
        height,
        undefined,
        'FAST'
      );

      logoHeight = height;
    } catch (error) {
      console.warn('Invoice logo could not be added:', error);
    }
  }

  // Only populated business settings are printed
  const businessFields = [
    settings.businessName?.trim(),
    settings.address?.trim(),
    settings.phone?.trim()
      ? `Phone: ${settings.phone.trim()}`
      : '',
    settings.email?.trim()
      ? `Email: ${settings.email.trim()}`
      : '',
    settings.gstin?.trim()
      ? `GSTIN: ${settings.gstin.trim()}`
      : '',
    settings.state?.trim()
      ? `State: ${settings.state.trim()}`
      : ''
  ].filter((value): value is string => Boolean(value));

  const businessTextX = logo ? margin + 17 : margin;
  const businessStartY = y;

  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);

  let businessTextY = businessStartY;

  for (const field of businessFields) {
    const wrapped = pdf.splitTextToSize(
      field,
      right - businessTextX
    ) as string[];

    pdf.text(wrapped, businessTextX, businessTextY);
    businessTextY += wrapped.length * 4.5;
  }

  y = Math.max(
    businessStartY + logoHeight,
    businessTextY
  ) + 5;

  // Invoice number and date
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);

  ensureSpace(10);

  pdf.text(
    `Invoice No: ${invoice.invoiceNumber}`,
    margin,
    y
  );

  const invoiceDate = invoice.invoiceDate
    ? new Date(invoice.invoiceDate)
    : new Date();

  pdf.text(
    `Date: ${invoiceDate.toLocaleDateString('en-IN')}`,
    right,
    y,
    { align: 'right' }
  );

  y += 8;

  const drawColor: [number, number, number] = monochrome
    ? [90, 90, 90]
    : [rgb[0], rgb[1], rgb[2]];

  pdf.setDrawColor(...drawColor);
  pdf.line(margin, y, right, y);

  y += 8;

  // Customer details
  pdf.setFont('helvetica', 'bold');
  line('BILL TO');

  pdf.setFont('helvetica', 'normal');

  if (invoice.customer?.name?.trim()) {
    line(invoice.customer.name.trim());
  }

  if (invoice.customer?.mobile?.trim()) {
    line(`Mobile: ${invoice.customer.mobile.trim()}`);
  }

  if (invoice.customer?.email?.trim()) {
    line(`Email: ${invoice.customer.email.trim()}`);
  }

  if (invoice.customer?.address?.trim()) {
    line(`Address: ${invoice.customer.address.trim()}`);
  }

  if (invoice.customer?.gstin?.trim()) {
    line(`GSTIN: ${invoice.customer.gstin.trim()}`);
  }

  y += 5;

  // Product table
  const columns = [margin, 88, 108, 128, 148, right];

  const headers = [
    'Product',
    'Qty',
    'Price',
    'Discount',
    'GST',
    'Amount'
  ];

  ensureSpace(16);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);

  pdf.setFillColor(
    ...(monochrome
      ? [235, 235, 235] as [number, number, number]
      : accent)
  );

  pdf.rect(
    margin,
    y - 4,
    pageWidth - margin * 2,
    9,
    'F'
  );

  pdf.setTextColor(
    monochrome ? 0 : 255,
    monochrome ? 0 : 255,
    monochrome ? 0 : 255
  );

  headers.forEach((header, index) => {
    pdf.text(header, columns[index] + 1, y + 1);
  });

  pdf.setTextColor(0, 0, 0);
  y += 10;

  pdf.setFont('helvetica', 'normal');

  for (const item of invoice.items ?? []) {
    const discount = Number(
      item.lineDiscount ??
      (
        item.quantity *
        item.unitPrice *
        Number(item.discountPercent ?? 0) / 100
      )
    );

    const tax = Number(item.lineTax ?? 0);

    const total = Number(
      item.lineTotal ??
      (item.quantity * item.unitPrice - discount + tax)
    );

    const productLines = pdf.splitTextToSize(
      String(item.name || 'Product'),
      48
    ) as string[];

    const rowHeight = Math.max(
      8,
      productLines.length * 4.5
    );

    ensureSpace(rowHeight + 4);

    pdf.text(productLines, columns[0] + 1, y);
    pdf.text(`${item.quantity} ${item.unit || ''}`.trim(), columns[1] + 1, y);
    pdf.text(rupees(item.unitPrice), columns[2] + 1, y);
    pdf.text(rupees(discount), columns[3] + 1, y);
    pdf.text(rupees(tax), columns[4] + 1, y);

    pdf.text(
      rupees(total),
      right - 1,
      y,
      { align: 'right' }
    );

    y += rowHeight;

    pdf.setDrawColor(230);
    pdf.line(margin, y - 2, right, y - 2);
  }

  // Invoice totals
  y += 5;

  const calc = invoice.calculation;

  const totals: Array<[string, number]> = [
    ['Subtotal', calc.subtotal],
    ['Discount', -calc.discountTotal],
    ['Taxable amount', calc.taxableAmount],
    ['GST total', calc.gstTotal],
    ['Invoice total', calc.total],
    ['Amount received', calc.paidAmount],
    ['Balance due', calc.dueAmount]
  ];

  for (const [label, value] of totals) {
    ensureSpace(8);

    const isTotal = label === 'Invoice total';

    pdf.setFont(
      'helvetica',
      isTotal ? 'bold' : 'normal'
    );

    pdf.text(label, right - 65, y);

    pdf.text(
      rupees(value),
      right,
      y,
      { align: 'right' }
    );

    y += isTotal ? 8 : 6;
  }

  // Payment and notes
  ensureSpace(18);
  y += 5;

  pdf.setFont('helvetica', 'normal');

  if (invoice.paymentMethod?.trim()) {
    pdf.text(
      `Payment method: ${invoice.paymentMethod}`,
      margin,
      y
    );
    y += 7;
  }

  if (invoice.notes?.trim()) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Notes:', margin, y);

    y += 5;

    pdf.setFont('helvetica', 'normal');
    line(invoice.notes.trim());
  }

  // Footer appears only when configured in settings
  if (settings.footer?.trim()) {
    ensureSpace(10);

    y += 5;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(...accent);

    pdf.text(
      settings.footer.trim(),
      pageWidth / 2,
      Math.min(y, pageHeight - 12),
      { align: 'center' }
    );
  }

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
