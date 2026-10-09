import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';

import {
  SubscriptionService,
  SubscriptionSettings,
  PlanSetting,
  BillingPriceSetting,
} from '../../core/subscription.service';

import {
  PaymentRecord,
  PaymentStatus,
} from '../../payment/models/payment.model';

import { PaymentService } from '../../payment/services/payment.service';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    TitleCasePipe,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './admin-subscription-payment.component.html',
  styleUrl: './admin-subscription-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSubscriptionPaymentComponent implements OnInit {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly paymentService = inject(PaymentService);

  settings: SubscriptionSettings | null = null;

  readonly planKeys = ['basic', 'premium', 'custom'] as const;

  readonly billingCycles = [
    { key: 'monthly', label: 'Monthly' },
    { key: 'halfYearly', label: 'Half-Yearly' },
    { key: 'yearly', label: 'Yearly' },
  ] as const;

  payments: PaymentRecord[] = [];

  statusFilter: PaymentStatus | '' = '';

  loading = true;
  saving = false;
  paymentsLoading = false;

  error = '';
  success = '';

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.error = '';
    this.success = '';
    this.loading = true;

    this.subscriptionService
      .getAdminSettings()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (settings) => {
          this.settings = settings;
        },
        error: (err) => {
          this.error =
            err?.error?.message ||
            'Could not load subscription settings.';
        },
      });

    this.loadPayments();
  }

  loadPayments(): void {
    this.paymentsLoading = true;

    this.paymentService
      .listAdminPayments(this.statusFilter || undefined)
      .pipe(
        finalize(() => {
          this.paymentsLoading = false;
        })
      )
      .subscribe({
        next: (payments) => {
          this.payments = payments;
        },
        error: (err) => {
          this.error =
            err?.error?.message ||
            'Could not load payments.';
        },
      });
  }

  private toBillingPayload(
    billing: BillingPriceSetting
  ): BillingPriceSetting {
    return {
      baseAmount: Number(billing.baseAmount),
      actualAmount: Number(billing.actualAmount),
      discountPercentage: Number(billing.discountPercentage),
      enabled: Boolean(billing.enabled),
    };
  }

  private toPlanPayload(plan: PlanSetting): PlanSetting {
    return {
      enabled: Boolean(plan.enabled),
      billing: {
        monthly: this.toBillingPayload(plan.billing.monthly),
        halfYearly: this.toBillingPayload(plan.billing.halfYearly),
        yearly: this.toBillingPayload(plan.billing.yearly),
      },
    };
  }

  saveSettings(): void {
    if (!this.settings || this.saving) {
      return;
    }

    this.saving = true;
    this.error = '';
    this.success = '';

    const current = this.settings;

    const payload: Partial<SubscriptionSettings> = {
      trialEnabled: current.trialEnabled,
      trialDays: Number(current.trialDays),
      gracePeriodHours: Number(current.gracePeriodHours),

      plans: {
        basic: this.toPlanPayload(current.plans.basic),
        premium: this.toPlanPayload(current.plans.premium),
        custom: this.toPlanPayload(current.plans.custom),
      },
    };

    this.subscriptionService
      .updateAdminSettings(payload)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe({
        next: (settings) => {
          this.settings = settings;
          this.success = 'Subscription settings saved successfully.';
        },
        error: (err) => {
          this.error =
            err?.error?.message ||
            'Could not save settings.';
        },
      });
  }
}