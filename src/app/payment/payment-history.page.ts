import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { PaymentRecord, PaymentStatus } from './models/payment.model';
import { PaymentService } from './services/payment.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, DatePipe, TitleCasePipe, RouterLink],
  templateUrl: './payment-history.page.html',
  styleUrl: './payment-history.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentHistoryPage implements OnInit {
  private readonly paymentService = inject(PaymentService);

  payments: PaymentRecord[] = [];
  loading = true;
  error = '';
  cancelling = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.paymentService.listPayments().pipe(finalize(() => (this.loading = false))).subscribe({
      next: (payments) => (this.payments = payments),
      error: (err) => (this.error = err?.error?.message || 'Could not load payment history.'),
    });
  }

  cancel(payment: PaymentRecord): void {
    if (!['pending', 'processing'].includes(payment.status) || this.cancelling) return;
    this.cancelling = payment.paymentId;
    this.paymentService.cancelPayment(payment.paymentId).pipe(finalize(() => (this.cancelling = ''))).subscribe({
      next: (updated) => {
        this.payments = this.payments.map((item) => item.paymentId === updated.paymentId ? updated : item);
      },
      error: (err) => (this.error = err?.error?.message || 'Could not cancel this payment.'),
    });
  }

  statusClass(status: PaymentStatus): string {
    return `status-${status}`;
  }

  trackByPayment(_index: number, payment: PaymentRecord): string {
    return payment.paymentId;
  }
}
