
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
  readonly printingInvoice = signal(false);
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
      .post<{
        id?: string;
        invoiceNumber: string;
        pdfUrl?: string;
        dueRecordId?: string;
      }>(`${this.invoiceEndpoint}/finalize`, requestPayload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: result => {
          this.success.set(
            `Invoice ${result.invoiceNumber} created successfully.`,
          );
          this.lastInvoiceId.set(result.id ?? '');

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
