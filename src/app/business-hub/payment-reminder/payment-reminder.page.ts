import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { API_BASE_URL } from '../../core/api.config';

interface DuePayment {
  amount: number;
  paymentMethod: string;
  paidAt?: string;
  note?: string;
  idempotencyKey?: string;
}

interface DueRecord {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customer: { name: string; mobile: string; email?: string; address?: string };
  invoiceTotal: number;
  amountPaid: number;
  balanceDue: number;
  status: 'due' | 'partially-paid' | 'paid';
  payments?: DuePayment[];
  createdAt?: string;
}

@Component({
  selector: 'bt-payment-reminder-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-reminder.page.html',
  styleUrl: './payment-reminder.page.scss',
})
export class PaymentReminderPage implements OnInit {
  private readonly endpoint = `${API_BASE_URL}/business-hub/invoices`;

  readonly records = signal<DueRecord[]>([]);
  readonly loading = signal(false);
  readonly savingId = signal('');
  readonly error = signal('');
  readonly success = signal('');
  readonly statusFilter = signal('open');
  readonly paymentMethods = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Other'];

  readonly selectedRecord = signal<DueRecord | null>(null);
  readonly paymentAmount = signal<number | null>(null);
  readonly paymentMethod = signal('Cash');
  readonly paymentNote = signal('');
  readonly dialogError = signal('');
  readonly reviewingPayment = signal(false);

  private readonly paymentIdempotencyKeys: Record<string, string> = {};

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.loading.set(true);
    this.error.set('');
    const status = this.statusFilter();
    const url = status === 'open'
      ? `${this.endpoint}/due-records`
      : `${this.endpoint}/due-records?status=${encodeURIComponent(status)}`;

    this.http.get<{ items: DueRecord[] }>(url)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: result => {
          const items = result.items ?? [];
          this.records.set(status === 'open'
            ? items.filter(item => item.status !== 'paid' && item.balanceDue > 0)
            : items);
        },
        error: err => this.error.set(err?.error?.message || 'Could not load customer dues.'),
      });
  }

  changeFilter(value: string): void {
    this.statusFilter.set(value);
    this.loadRecords();
  }

  openPaymentDialog(record: DueRecord): void {
    if (record.balanceDue <= 0 || this.savingId()) return;

    this.selectedRecord.set(record);
    this.paymentAmount.set(this.roundMoney(record.balanceDue));
    this.paymentMethod.set('Cash');
    this.paymentNote.set('');
    this.dialogError.set('');
    this.reviewingPayment.set(false);
    this.paymentIdempotencyKeys[record.id] ||= this.createIdempotencyKey();
  }

  closePaymentDialog(): void {
    if (this.savingId()) return;
    this.selectedRecord.set(null);
    this.dialogError.set('');
    this.reviewingPayment.set(false);
  }

  setPaymentAmount(value: unknown): void {
    if (value === '' || value === null || value === undefined) {
      this.paymentAmount.set(null);
      return;
    }

    const amount = Number(value);
    this.paymentAmount.set(Number.isFinite(amount) ? amount : null);
    this.dialogError.set('');
  }

  reviewPayment(): void {
    const record = this.selectedRecord();
    const amount = Number(this.paymentAmount());

    if (!record) return;
    if (!Number.isFinite(amount) || amount <= 0) {
      this.dialogError.set('Enter a payment amount greater than zero.');
      return;
    }
    if (this.roundMoney(amount) > this.roundMoney(record.balanceDue)) {
      this.dialogError.set('Payment cannot exceed the outstanding balance.');
      return;
    }

    this.paymentAmount.set(this.roundMoney(amount));
    this.dialogError.set('');
    this.reviewingPayment.set(true);
  }

  editPayment(): void {
    if (this.savingId()) return;
    this.reviewingPayment.set(false);
    this.dialogError.set('');
  }

  confirmPayment(): void {
    const record = this.selectedRecord();
    const amount = Number(this.paymentAmount());
    if (!record || this.savingId()) return;

    if (!Number.isFinite(amount) || amount <= 0 || this.roundMoney(amount) > this.roundMoney(record.balanceDue)) {
      this.dialogError.set('Enter a valid amount within the outstanding balance.');
      this.reviewingPayment.set(false);
      return;
    }

    const draftKey = this.paymentIdempotencyKeys[record.id] || this.createIdempotencyKey();
    this.paymentIdempotencyKeys[record.id] = draftKey;
    this.error.set('');
    this.success.set('');
    this.dialogError.set('');
    this.savingId.set(record.id);

    this.http.post<DueRecord>(
      `${this.endpoint}/due-records/${encodeURIComponent(record.id)}/payments`,
      {
        amount: this.roundMoney(amount),
        paymentMethod: this.paymentMethod(),
        note: this.paymentNote().trim(),
        idempotencyKey: draftKey,
      },
    ).pipe(finalize(() => this.savingId.set(''))).subscribe({
      next: updated => {
        this.records.update(items => items.map(item => item.id === updated.id ? updated : item));
        this.success.set(
          updated.status === 'paid'
            ? `Invoice ${updated.invoiceNumber} is fully paid.`
            : `Payment recorded. Remaining due for ${updated.invoiceNumber}: ${this.money(updated.balanceDue)}.`,
        );

        if (this.statusFilter() === 'open' && (updated.status === 'paid' || updated.balanceDue <= 0)) {
          this.records.update(items => items.filter(item => item.id !== updated.id));
        }

        this.selectedRecord.set(null);
        this.reviewingPayment.set(false);
        delete this.paymentIdempotencyKeys[updated.id];
      },
      error: err => {
        this.dialogError.set(err?.error?.message || 'Payment could not be recorded. Please try again.');
      },
    });
  }

  remainingAfterPayment(): number {
    const record = this.selectedRecord();
    const amount = Number(this.paymentAmount()) || 0;
    return record ? this.roundMoney(Math.max(0, record.balanceDue - amount)) : 0;
  }

  money(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  }

  private roundMoney(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private createIdempotencyKey(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `payment-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  }

  getQuickPaymentAmount(balance: number, percentage: number): number {
  const due = Math.max(0, Number(balance) || 0);

  if (percentage === 100) {
    return due;
  }

  const calculatedAmount = due * (percentage / 100);

  const roundedAmount = Math.ceil(calculatedAmount / 10) * 10;

  return Math.min(due, roundedAmount);
}
}
