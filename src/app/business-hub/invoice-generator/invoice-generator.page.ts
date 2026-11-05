import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { InvoiceSettingsService } from '../models/invoice-settings.service';
import { InvoiceDesignService } from '../invoice-design/services/invoice-design.service';
import type {
  InvoicePdfData,
  InvoicePdfSettings,
} from '../invoice-design/core/invoice-document.model';
import { InvoiceApiService } from '../models/invoice-api.service';
import {
  InvoiceDraftPayload,
  InvoicePaymentMethod,
} from '../models/invoice.model';
import { BusinessProfileService } from '../../dashboard/business-profile/business-profile.service';
import type { jsPDF } from 'jspdf';
import {
  MyStockApiService,
  StockItem,
} from '../../core/my-stock-api.service';
import { CustomerApiService } from '../../core/customer-api.service';
import { ConfirmDialogService } from '../../Common/components/confirm-dialog/confirm-dialog.service';

interface InvoiceLine {
  itemType: 'stock' | 'custom';
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

interface ManualInvoiceItemDraft {
  name: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercent: number;
  gstEnabled: boolean;
  gstRate: number;
}

interface InvoiceCustomer {
  name: string;
  mobile: string;
  email: string;
  address: string;
  gstin: string;
}

type FinalizedInvoice = InvoicePdfData;

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
  readonly successDialogOpen = signal(false);
  readonly successDialogMessage = signal('');
  readonly lastInvoiceId = signal('');
  readonly lastInvoice = signal<FinalizedInvoice | null>(null);
  readonly printingInvoice = signal(false);
  readonly generatingPdf = signal(false);
  readonly sharingPdf = signal(false);
  readonly previewMode = signal(false);

  readonly items = signal<InvoiceLine[]>([]);
  readonly showManualItemForm = signal(false);
  manualItem: ManualInvoiceItemDraft = this.emptyManualItem();

  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + this.lineSubtotal(item), 0),
  );

  readonly discountTotal = computed(() =>
    this.items().reduce((sum, item) => sum + this.lineDiscount(item), 0),
  );

  readonly taxableAmount = computed(() =>
    Math.max(0, this.subtotal() - this.discountTotal()),
  );

  readonly gstTotal = computed(() =>
    this.items().reduce((sum, item) => sum + this.lineTax(item), 0),
  );

  readonly unroundedTotal = computed(() =>
    this.roundMoney(this.taxableAmount() + this.gstTotal()),
  );

  readonly grandTotal = computed(() => this.unroundedTotal());
  readonly roundOff = computed(() => 0);
  readonly paidAmount = signal(0);

  readonly dueAmount = computed(() =>
    this.roundMoney(Math.max(0, this.grandTotal() - this.paidAmount())),
  );

  footerText = 'This is a computer-generated invoice.';
  poweredByText = 'Powered by BRAIN TECHNO | www.braintechno.com-test';

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
    private readonly invoiceApi: InvoiceApiService,
    private readonly businessProfileService: BusinessProfileService,
    private readonly invoiceDesignService: InvoiceDesignService,
    private readonly customerApi: CustomerApiService,
    private readonly confirmDialog: ConfirmDialogService,
  ) {}

  ngOnInit(): void {
    this.loadStock();
  }

  private emptyManualItem(): ManualInvoiceItemDraft {
    return {
      name: '',
      description: '',
      quantity: 1,
      unit: 'pcs',
      unitPrice: 0,
      discountPercent: 0,
      gstEnabled: false,
      gstRate: 18,
    };
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

  /**
   * Converts Indian mobile formats to a canonical 10-digit number.
   * Accepted examples:
   * 9876543210
   * +91 9876543210
   * 919876543210
   * 09876543210
   * 0919876543210
   */
  private normalizeIndianMobile(value: unknown): string {
    const digits = String(value ?? '').replace(/\D/g, '');

    let mobile = digits;

    if (digits.length === 13 && digits.startsWith('091')) {
      mobile = digits.slice(3);
    } else if (digits.length === 12 && digits.startsWith('91')) {
      mobile = digits.slice(2);
    } else if (digits.length === 11 && digits.startsWith('0')) {
      mobile = digits.slice(1);
    }

    return /^[6-9]\d{9}$/.test(mobile) ? mobile : '';
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

  handleProductSelection(value: string): void {
    if (!value) return;

    if (value === '__manual_item__') {
      this.showManualItemForm.set(true);
      this.error.set('');
      return;
    }

    this.showManualItemForm.set(false);
    this.addProduct(value);
  }

  addProduct(stockId: string): void {
    if (!stockId) return;

    const product = this.stockItems().find(item => item.id === stockId);

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
      itemType: 'stock',
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

  addManualItem(): void {
    const name = this.manualItem.name.trim();
    const description = this.manualItem.description.trim();
    const unit = this.manualItem.unit.trim() || 'pcs';
    const quantity = this.clamp(this.manualItem.quantity, 1, 1_000_000);
    const unitPrice = this.roundMoney(this.clamp(this.manualItem.unitPrice, 0, 100_000_000_000));
    const discountPercent = this.roundMoney(this.clamp(this.manualItem.discountPercent, 0, 100));
    const gstRate = this.manualItem.gstEnabled
      ? this.roundMoney(this.clamp(this.manualItem.gstRate, 0, 100))
      : 0;

    if (!name) {
      this.error.set('Enter the item or charge name.');
      return;
    }
    if (name.length > 120 || description.length > 1000 || unit.length > 30) {
      this.error.set('Please shorten the item name, details, or unit.');
      return;
    }

    const line: InvoiceLine = {
      itemType: 'custom',
      stockItemId: '',
      name,
      description,
      sku: '',
      quantity,
      unit,
      unitPrice,
      discountPercent,
      gstEnabled: this.manualItem.gstEnabled,
      gstRate,
      availableQuantity: 1_000_000,
    };

    this.items.update(lines => [...lines, line]);
    this.manualItem = this.emptyManualItem();
    this.showManualItemForm.set(false);
    this.idempotencyKey = this.createIdempotencyKey();
    this.error.set('');
    this.previewMode.set(false);
  }

  toggleManualItemForm(): void {
    this.showManualItemForm.update(value => !value);
    this.error.set('');
  }

  updateLine(
    index: number,
    field: 'quantity' | 'unitPrice' | 'discountPercent',
    value: number,
  ): void {
    const lines = [...this.items()];
    const item = lines[index];

    if (!item) return;

    if (field === 'quantity') {
      item.quantity = Math.floor(
        this.clamp(value, 1, item.itemType === 'stock' ? item.availableQuantity : 1_000_000),
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
      (this.lineSubtotal(item) *
        this.clamp(item.discountPercent, 0, 100)) /
        100,
    );
  }

  lineTax(item: InvoiceLine): number {
    if (!item.gstEnabled) return 0;

    const taxable = this.lineSubtotal(item) - this.lineDiscount(item);

    return this.roundMoney(
      (taxable * this.clamp(item.gstRate, 0, 100)) / 100,
    );
  }

  setPaidAmount(value: number): void {
    this.paidAmount.set(
      this.roundMoney(this.clamp(value, 0, this.grandTotal())),
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

    if (this.saving()) return;

    const normalizedMobile = this.normalizeIndianMobile(
      this.customer.mobile,
    );

    const fingerprint = JSON.stringify({
      customer: {
        ...this.customer,
        mobile: normalizedMobile || this.customer.mobile.trim(),
      },
      items: this.items().map(item => ({
        itemType: item.itemType,
        stockItemId: item.itemType === 'stock' ? item.stockItemId : undefined,
        name: item.itemType === 'custom' ? item.name : undefined,
        description: item.itemType === 'custom' ? item.description : undefined,
        unit: item.unit,
        gstEnabled: item.gstEnabled,
        gstRate: item.gstRate,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discountPercent: item.discountPercent,
      })),
      paymentAmount: this.paidAmount(),
      paymentMethod: this.paymentMethod,
      notes: this.notes.trim(),
    });

    if (
      !this.idempotencyKey ||
      this.idempotencyFingerprint !== fingerprint
    ) {
      this.idempotencyKey = this.createIdempotencyKey();
      this.idempotencyFingerprint = fingerprint;
    }

    const payload: InvoiceDraftPayload = {
      customer: {
        name: this.customer.name.trim(),
        mobile: normalizedMobile || this.customer.mobile.trim(),
        email: this.customer.email.trim(),
        address: this.customer.address.trim(),
        gstin: this.customer.gstin.trim().toUpperCase(),
      },
      items: this.items().map(item => ({
        itemType: item.itemType,
        ...(item.itemType === 'stock' ? { stockItemId: item.stockItemId } : {}),
        name: item.name,
        description: item.description,
        sku: item.sku,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        discountPercent: item.discountPercent,
        gstEnabled: item.gstEnabled,
        gstRate: item.gstRate,
      })),
      paymentAmount: this.paidAmount(),
      paymentMethod: this.paymentMethod as unknown as InvoicePaymentMethod,
      notes: this.notes.trim(),
      idempotencyKey: this.idempotencyKey,
    };

    // A mobile number is required for customer matching.
    // Fully paid invoices without a mobile number can still be finalized.
    if (!normalizedMobile) {
      this.submitInvoice(payload);
      return;
    }

    this.saving.set(true);

    this.customerApi.findByMobile(normalizedMobile)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: result => {
          // findByMobile has completed its useful work. Release its lock before
          // opening the dialog or starting the next request.
          this.saving.set(false);
          const existingCustomer = result?.item ?? null;

          if (existingCustomer) {
            const customerName =
              existingCustomer.name?.trim() || 'this customer';

            this.confirmDialog.confirm({
              title: 'Update existing customer?',
              subtitle: `A customer named "${customerName}" already exists with this mobile number. Do you want to update only the customer's Name, Email and Address with the details entered in this invoice? Choosing No will keep the existing customer details unchanged and still create the invoice.`,
              type: 'warning',
              icon: 'warning',
              showCancel: true,
              successButtonName: 'Yes, Update',
              cancelButtonName: 'No, Keep Existing',
              success: () => this.syncCustomerThenFinalize(payload, true),
              cancel: () => this.submitInvoice(payload),
            });
            return;
          }

          this.syncCustomerThenFinalize(payload, false);
        },
        error: err => {
          console.error('Customer lookup failed:', err);
          this.error.set(
            err?.error?.message ||
              'Could not verify the customer mobile number. Invoice was not finalized.',
          );
        },
      });
  }

  private syncCustomerThenFinalize(
    invoicePayload: InvoiceDraftPayload,
    updateExisting: boolean,
  ): void {
    const mobile = this.normalizeIndianMobile(this.customer.mobile);

    if (!mobile) {
      this.submitInvoice(invoicePayload);
      return;
    }

    this.saving.set(true);

    this.customerApi
      .syncFromInvoice({
        name: this.customer.name.trim(),
        mobile,
        email: this.customer.email.trim(),
        address: this.customer.address.trim(),
        updateExisting,
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          // Release the customer-sync lock before submitInvoice checks saving().
          this.saving.set(false);
          this.submitInvoice(invoicePayload);
        },
        error: err => {
          console.error('Customer synchronization failed:', err);
          this.error.set(
            err?.error?.message ||
              'Could not save customer details. Invoice was not finalized.',
          );
        },
      });
  }

  private submitInvoice(payload: InvoiceDraftPayload): void {
    if (this.saving()) return;

    this.saving.set(true);

    this.invoiceApi
      .finalize(payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: response => {
          const invoice: FinalizedInvoice = {
            id: response.id,
            invoiceNumber: response.invoiceNumber,
            invoiceDate: response.invoiceDate,
            customer: response.customer,
            items: response.items.map(item => ({
              ...item,
              availableQuantity: 0,
            })),
            calculation: {
              subtotal: response.calculation.subtotal,
              discountTotal: response.calculation.discountTotal,
              taxableAmount: response.calculation.taxableAmount,
              gstTotal: response.calculation.gstTotal,
              roundOff: 0,
              total: response.calculation.total,
              paidAmount: response.calculation.paidAmount,
              dueAmount: response.calculation.dueAmount,
            },
            paymentMethod: response.paymentMethod,
            notes: response.notes,
          };

          this.lastInvoice.set(invoice);
          this.lastInvoiceId.set(invoice.id);

          const hasStockProducts = this.items().some(
            item => item.itemType === 'stock',
          );
          this.successDialogMessage.set(
            invoice.calculation.dueAmount > 0
              ? hasStockProducts
                ? 'Customer and due details are stored. Stock products have been deducted; other charges were added without stock changes.'
                : 'Customer and due details are stored. Manual items and charges were added without changing stock.'
              : hasStockProducts
                ? 'Invoice saved successfully. Stock products have been deducted; other charges were added without stock changes.'
                : 'Invoice saved successfully. Manual items and charges were added without changing stock.',
          );

          this.successDialogOpen.set(true);
          this.success.set('');
          this.previewMode.set(false);
          this.idempotencyKey = '';
          this.idempotencyFingerprint = '';
          this.loadStock();
        },
        error: err => {
          console.error('Invoice finalization failed:', err);
          this.error.set(
            err?.error?.message ||
              'Invoice could not be finalized. Please try again.',
          );
        },
      });
  }

  closeSuccessDialog(): void {
    this.successDialogOpen.set(false);
  }

  async openInvoiceForPrint(): Promise<void> {
    const invoice = this.lastInvoice();

    if (!invoice || this.printingInvoice()) return;

    this.printingInvoice.set(true);

    try {
      const pdf = await this.createInvoicePdf(invoice);
      pdf.autoPrint();

      const url = pdf.output('bloburl');
      const opened = window.open(url, '_blank');

      if (!opened) {
        this.error.set(
          'Popup blocked. Please allow pop-ups, or use Download PDF.',
        );
      } else {
        this.error.set('');
      }
    } catch (error) {
      console.error('Invoice print failed:', error);
      this.error.set('Could not prepare the invoice for printing.');
    } finally {
      this.printingInvoice.set(false);
    }
  }

  async downloadInvoicePdf(): Promise<void> {
    const invoice = this.lastInvoice();

    if (!invoice) {
      this.error.set(
        'Please create an invoice before downloading the PDF.',
      );
      return;
    }

    if (this.generatingPdf()) return;

    this.generatingPdf.set(true);
    this.error.set('');
    this.success.set('');

    let objectUrl: string | null = null;

    try {
      const pdf = await this.createInvoicePdf(invoice);
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

      this.success.set(
        `PDF download started for ${invoice.invoiceNumber}.`,
      );

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
          : 'PDF download failed. Please try again.',
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
      const pdf = await this.createInvoicePdf(invoice);
      const blob = pdf.output('blob');

      const file = new File(
        [blob],
        `${this.safeFilename(invoice.invoiceNumber)}.pdf`,
        { type: 'application/pdf' },
      );

      if (
        typeof navigator !== 'undefined' &&
        'share' in navigator &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: `Invoice ${invoice.invoiceNumber}`,
          text: `Invoice ${invoice.invoiceNumber} from BRAIN TECHNO`,
        });

        this.success.set(
          `Invoice ${invoice.invoiceNumber} shared successfully.`,
        );
      } else {
        pdf.save(`${this.safeFilename(invoice.invoiceNumber)}.pdf`);
        this.success.set(
          'PDF downloaded. Attach it in WhatsApp, email, or your preferred app to share.',
        );
      }
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        return;
      }

      console.error('Invoice PDF sharing failed:', error);
      this.error.set(
        'Could not share the PDF. Try Download PDF and share the downloaded file.',
      );
    } finally {
      this.sharingPdf.set(false);
    }
  }

  private createInvoicePdf(invoice: FinalizedInvoice): Promise<jsPDF> {
    const settings = this.invoiceSettingsService.get();
    const businessLogo = String(
      this.businessProfileService.profile()?.profile?.businessLogo || '',
    );

    return this.invoiceDesignService.renderPdf(
      invoice,
      settings as InvoicePdfSettings,
      businessLogo,
      this.footerText,
      this.poweredByText,
    );
  }

  private safeFilename(value: string): string {
    return String(value || 'invoice').replace(/[^a-z0-9-_]/gi, '_');
  }

  resetInvoice(): void {
    if (this.saving()) return;

    this.customer = this.emptyCustomer();
    this.items.set([]);
    this.manualItem = this.emptyManualItem();
    this.showManualItemForm.set(false);
    this.paidAmount.set(0);
    this.paymentMethod = 'Cash';
    this.notes = '';
    this.idempotencyKey = '';
    this.idempotencyFingerprint = '';
    this.error.set('');
    this.success.set('');
    this.successDialogOpen.set(false);
    this.successDialogMessage.set('');
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

      if (item.itemType === 'stock' && item.quantity > item.availableQuantity) {
        return `Only ${item.availableQuantity} ${item.unit} available for ${item.name}.`;
      }

      if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
        return `Enter a valid price for ${item.name}.`;
      }
    }

    const enteredMobile = this.customer.mobile.trim();

    if (this.dueAmount() > 0) {
      if (!this.customer.name.trim()) {
        return 'Customer name is required when payment is due.';
      }

      if (!enteredMobile) {
        return 'Customer mobile is required when payment is due.';
      }
    }

    if (enteredMobile && !this.normalizeIndianMobile(enteredMobile)) {
      return 'Enter a valid 10-digit Indian mobile number.';
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

    if (!Number.isFinite(number)) return minimum;

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