
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  MyStockApiService,
  StockItem,
} from '../../core/my-stock-api.service';


import {
  FinalizedInvoiceResponse,
  InvoiceCalculation,
  InvoiceCustomer,
  InvoiceDraftPayload,
  InvoiceLine,
  InvoicePaymentMethod,
} from '../models/invoice.model';
import { InvoiceApiService } from '../models/invoice-api.service';

@Component({
  selector: 'app-invoice-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice.page.html',
  styleUrl: './invoice.page.scss',
})
export class InvoicePage implements OnInit {
  stockItems: StockItem[] = [];
  selectedStockId = '';
  quantityToAdd = 1;

  customer: InvoiceCustomer = {
    name: '',
    mobile: '',
    email: '',
    address: '',
    gstin: '',
  };

  items: InvoiceLine[] = [];

  paymentAmount = 0;
  paymentMethod: InvoicePaymentMethod = 'cash';
  notes = '';

  calculation: InvoiceCalculation | null = null;
  finalized: FinalizedInvoiceResponse | null = null;

  loadingStock = false;
  previewing = false;
  saving = false;

  error = '';
  success = '';

  readonly paymentMethods: {
    value: InvoicePaymentMethod;
    label: string;
  }[] = [
    { value: 'cash', label: 'Cash' },
    { value: 'upi', label: 'UPI' },
    { value: 'card', label: 'Card' },
    { value: 'bank-transfer', label: 'Bank transfer' },
    { value: 'other', label: 'Other' },
  ];

  constructor(
    private readonly stockApi: MyStockApiService,
    private readonly invoiceApi: InvoiceApiService,
  ) {}

  ngOnInit(): void {
    this.loadingStock = true;

    this.stockApi
      .list()
      .pipe(finalize(() => (this.loadingStock = false)))
      .subscribe({
        next: (result) => {
          this.stockItems = result.items ?? [];
        },
        error: (err) => {
          this.error =
            err?.error?.message || 'Could not load stock items.';
        },
      });
  }

  get selectedStock(): StockItem | undefined {
    return this.stockItems.find(
      (item) => item.id === this.selectedStockId,
    );
  }

  addItem(): void {
    const stock = this.selectedStock;

    if (!stock) {
      this.error = 'Choose a stock item first.';
      return;
    }

    if (
      !Number.isInteger(Number(this.quantityToAdd)) ||
      this.quantityToAdd < 1
    ) {
      this.error = 'Quantity must be a positive whole number.';
      return;
    }

    const existing = this.items.find(
      (item) => item.stockItemId === stock.id,
    );

    if (existing) {
      existing.quantity += Number(this.quantityToAdd);
    } else {
      this.items = [
        ...this.items,
        {
          stockItemId: stock.id,
          name: stock.name,
          description: stock.description || '',
          sku: stock.sku || '',
          quantity: Number(this.quantityToAdd),
          unit: stock.unit || 'piece',
          unitPrice: Number(
            stock.discountPrice ?? stock.originalPrice ?? 0,
          ),
          discountPercent: 0,
          gstEnabled: !!stock.gstEnabled,
          gstRate: Number(stock.gstRate || 0),
        },
      ];
    }

    this.error = '';
    this.success = '';
    this.calculation = null;
    this.finalized = null;
    this.quantityToAdd = 1;
  }

  removeItem(index: number): void {
    this.items = this.items.filter((_, i) => i !== index);
    this.calculation = null;
    this.finalized = null;
    this.success = '';
  }

  lineTotal(item: InvoiceLine): number {
    const quantity = Math.max(0, Number(item.quantity) || 0);
    const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
    const discountPercent = Math.min(
      100,
      Math.max(0, Number(item.discountPercent) || 0),
    );
    const gstRate = Math.max(0, Number(item.gstRate) || 0);

    const subtotal = quantity * unitPrice;
    const discounted =
      subtotal * (1 - discountPercent / 100);

    return (
      discounted +
      (item.gstEnabled ? (discounted * gstRate) / 100 : 0)
    );
  }

  get estimatedTotal(): number {
    return this.items.reduce(
      (sum, item) => sum + this.lineTotal(item),
      0,
    );
  }

  get dueAmount(): number {
    return Math.max(
      0,
      (this.calculation?.total ?? this.estimatedTotal) -
        Math.max(0, Number(this.paymentAmount) || 0),
    );
  }

  money(value: number | undefined): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value ?? 0);
  }

  private payload(): InvoiceDraftPayload | null {
    if (
      !this.customer.name.trim() ||
      !this.customer.mobile.trim()
    ) {
      this.error =
        'Enter the customer name and mobile number.';
      return null;
    }

    if (!this.items.length) {
      this.error = 'Add at least one item to the invoice.';
      return null;
    }

    if (
      !Number.isFinite(Number(this.paymentAmount)) ||
      Number(this.paymentAmount) < 0
    ) {
      this.error = 'Payment amount cannot be negative.';
      return null;
    }

    for (const item of this.items) {
      if (
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1
      ) {
        this.error =
          'Each item must have a quantity of at least 1.';
        return null;
      }

      if (
        !Number.isFinite(Number(item.unitPrice)) ||
        Number(item.unitPrice) < 0
      ) {
        this.error = 'Item prices cannot be negative.';
        return null;
      }

      if (
        !Number.isFinite(Number(item.discountPercent)) ||
        Number(item.discountPercent) < 0 ||
        Number(item.discountPercent) > 100
      ) {
        this.error =
          'Discount must be between 0 and 100.';
        return null;
      }
    }

    this.error = '';

    return {
      customer: {
        ...this.customer,
        name: this.customer.name.trim(),
        mobile: this.customer.mobile.trim(),
      },
      items: this.items.map((item) => ({ ...item })),
      paymentAmount: Number(this.paymentAmount || 0),
      paymentMethod: this.paymentMethod,
      notes: this.notes.trim() || undefined,
      idempotencyKey: this.createIdempotencyKey(),
    };
  }

  preview(): void {
    const payload = this.payload();

    if (!payload) {
      return;
    }

    this.previewing = true;
    this.error = '';
    this.success = '';

    this.invoiceApi
      .preview(payload)
      .pipe(finalize(() => (this.previewing = false)))
      .subscribe({
        next: (response:any) => {
          this.calculation = response.calculation;
          this.success = 'Invoice totals updated.';
        },
        error: (err:any) => {
          this.error =
            err?.error?.message ||
            'Could not calculate invoice totals.';
        },
      });
  }

  finalizeInvoice(): void {
    const payload = this.payload();

    if (!payload) {
      return;
    }

    this.saving = true;
    this.error = '';
    this.success = '';
    this.finalized = null;

    this.invoiceApi
      .finalize(payload)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (response:any) => {
          this.finalized = response;
          this.calculation = response.calculation;
          this.success = `Invoice ${response.invoiceNumber} created successfully.`;
        },
        error: (err:any) => {
          this.error =
            err?.error?.message ||
            'Could not finalize invoice.';
        },
      });
  }

  reset(): void {
    this.customer = {
      name: '',
      mobile: '',
      email: '',
      address: '',
      gstin: '',
    };

    this.selectedStockId = '';
    this.quantityToAdd = 1;
    this.items = [];
    this.paymentAmount = 0;
    this.paymentMethod = 'cash';
    this.notes = '';
    this.calculation = null;
    this.finalized = null;
    this.error = '';
    this.success = '';
  }

  private createIdempotencyKey(): string {
    return `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 12)}`;
  }
}
