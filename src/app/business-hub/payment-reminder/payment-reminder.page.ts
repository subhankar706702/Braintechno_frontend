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

  readonly paymentDrafts: Record<string, { amount: number | null; paymentMethod: string; note: string }> = {};

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.loading.set(true);
    this.error.set('');
    const status = this.statusFilter();
    const url = status === 'open'
      ? `${this.endpoint}/due-records?status=due` // Load due first; partially paid are merged below.
      : `${this.endpoint}/due-records?status=${encodeURIComponent(status)}`;

    if (status === 'open') {
      this.http.get<{ items: DueRecord[] }>(`${this.endpoint}/due-records`)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: result => {
            const items = result.items ?? [];
            this.records.set(items.filter(item => item.status !== 'paid'));
            this.prepareDrafts(this.records());
          },
          error: err => this.error.set(err?.error?.message || 'Could not load customer dues.'),
        });
      return;
    }

    this.http.get<{ items: DueRecord[] }>(url)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: result => {
          this.records.set(result.items ?? []);
          this.prepareDrafts(this.records());
        },
        error: err => this.error.set(err?.error?.message || 'Could not load customer dues.'),
      });
  }

  private prepareDrafts(records: DueRecord[]): void {
    for (const record of records) {
      if (!this.paymentDrafts[record.id]) {
        this.paymentDrafts[record.id] = {
          amount: record.balanceDue,
          paymentMethod: 'Cash',
          note: '',
        };
      } else {
        this.paymentDrafts[record.id].amount = record.balanceDue;
      }
    }
  }

  changeFilter(value: string): void {
    this.statusFilter.set(value);
    this.loadRecords();
  }

  recordPayment(record: DueRecord): void {
    const draft = this.paymentDrafts[record.id];
    const amount = Number(draft?.amount);
    if (this.savingId()) return;
    if (!Number.isFinite(amount) || amount <= 0) {
      this.error.set('Enter a payment amount greater than zero.');
      return;
    }
    if (amount > record.balanceDue) {
      this.error.set('Payment cannot exceed the outstanding balance.');
      return;
    }

    this.error.set('');
    this.success.set('');
    this.savingId.set(record.id);
    this.http.post<DueRecord>(`${this.endpoint}/due-records/${encodeURIComponent(record.id)}/payments`, {
      amount,
      paymentMethod: draft.paymentMethod,
      note: draft.note.trim(),
    }).pipe(finalize(() => this.savingId.set(''))).subscribe({
      next: updated => {
        this.records.update(items => items.map(item => item.id === updated.id ? updated : item));
        this.success.set(`Payment recorded for invoice ${updated.invoiceNumber}.`);
        this.paymentDrafts[updated.id] = {
          amount: updated.balanceDue,
          paymentMethod: draft.paymentMethod,
          note: '',
        };
        if (this.statusFilter() === 'open' && updated.status === 'paid') {
          this.records.update(items => items.filter(item => item.id !== updated.id));
        }
      },
      error: err => this.error.set(err?.error?.message || 'Payment could not be recorded. Please try again.'),
    });
  }

  money(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  }
}
