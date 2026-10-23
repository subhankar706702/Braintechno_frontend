import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import {
  BusinessTransaction,
  BusinessTransactionPeriod,
  BusinessTransactionType,
  SalesExpenseApiService,
} from './../../core/sales-expense-api.service';

@Component({
  selector: 'bt-sales-expense-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './sales-expense.page.html',
  styleUrl: './sales-expense.page.scss',
})
export class SalesExpensePage implements OnInit {
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly entries = signal<BusinessTransaction[]>([]);
  readonly period = signal<BusinessTransactionPeriod>('day');
  readonly formOpen = signal(false);
  readonly filterType = signal<'all' | BusinessTransactionType>('all');
  readonly summary = signal({ sales: 0, expenses: 0, net: 0, count: 0 });

  readonly categories = {
    sale: ['Product Sale', 'Service Income', 'Other Income'],
    expense: ['Stock Purchase', 'Rent', 'Salary', 'Utilities', 'Transport', 'Marketing', 'Other Expense'],
  };

  form: {
    type: BusinessTransactionType;
    entryDate: string;
    category: string;
    amount: number | null;
    paymentMethod: string;
    note: string;
  } = this.emptyForm();

  constructor(private readonly api: SalesExpenseApiService) {}

  ngOnInit(): void {
    this.load();
  }

  get visibleEntries(): BusinessTransaction[] {
    const type = this.filterType();
    return type === 'all' ? this.entries() : this.entries().filter(item => item.type === type);
  }

  get availableCategories(): string[] {
    return this.form.type === 'sale' ? this.categories.sale : this.categories.expense;
  }

  setPeriod(value: string): void {
    if (value !== 'day' && value !== 'week' && value !== 'month') return;
    this.period.set(value);
    this.load();
  }

  setType(value: string): void {
    if (value !== 'sale' && value !== 'expense') return;
    this.form.type = value;
    this.form.category = this.availableCategories[0];
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.list(this.period())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (result: any) => {
          this.entries.set(result.items ?? []);
          this.summary.set(result.summary ?? { sales: 0, expenses: 0, net: 0, count: 0 });
        },
        error: (err:any) => {
          this.error.set(err?.error?.message || 'Could not load sales and expenses. Please try again.');
        },
      });
  }

  openForm(type: BusinessTransactionType = 'sale'): void {
    this.form = this.emptyForm();
    this.form.type = type;
    this.form.category = this.availableCategories[0];
    this.formOpen.set(true);
    this.success.set('');
    this.error.set('');
  }

  closeForm(): void {
    if (!this.saving()) this.formOpen.set(false);
  }

  save(): void {
    this.error.set('');
    this.success.set('');

    const amount = Number(this.form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      this.error.set('Enter an amount greater than ₹0.');
      return;
    }
    if (!this.form.entryDate || !this.form.category) {
      this.error.set('Choose a date and category.');
      return;
    }

    this.saving.set(true);
    this.api.create({
      type: this.form.type,
      entryDate: this.form.entryDate,
      category: this.form.category,
      amount: Math.round(amount * 100) / 100,
      paymentMethod: this.form.paymentMethod,
      note: this.form.note.trim(),
    })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.formOpen.set(false);
          this.success.set('Entry saved successfully.');
          this.load();
        },
        error: (err:any) => this.error.set(err?.error?.message || 'Could not save this entry. Please try again.'),
      });
  }

  formatMoney(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 2,
    }).format(Number(value || 0));
  }

  trackById(_index: number, item: BusinessTransaction): string {
    return item.id;
  }

  private emptyForm() {
    const today = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date());
    return {
      type: 'sale' as BusinessTransactionType,
      entryDate: today,
      category: 'Product Sale',
      amount: null as number | null,
      paymentMethod: 'Cash',
      note: '',
    };
  }
}
