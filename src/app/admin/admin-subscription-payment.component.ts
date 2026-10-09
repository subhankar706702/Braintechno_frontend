import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { SubscriptionService, SubscriptionSettings } from '../core/subscription.service';
import { PaymentRecord, PaymentStatus } from '../payment/models/payment.model';
import { PaymentService } from '../payment/services/payment.service';

@Component({
  standalone: true,
  imports: [FormsModule, DatePipe, TitleCasePipe, MatButtonModule, MatIconModule],
  template: `
    <div class="bt-page admin-subscription-page">
      <div class="bt-page-head">
        <div><h1>Subscription & Payments</h1><p class="bt-muted">Control subscription pricing, trial, grace period and payment records.</p></div>
        <button class="bt-btn secondary" type="button" (click)="loadAll()" [disabled]="loading">Refresh</button>
      </div>

      @if (error) { <div class="error-box">{{ error }}</div> }
      @if (success) { <div class="success-box">{{ success }}</div> }

      @if (settings) {
        <section class="settings-grid">
          <article class="bt-card panel wide">
            <div class="panel-head"><div><h2>Subscription settings</h2><p>These values are used for new trials and new payment requests.</p></div><button class="bt-btn primary" type="button" (click)="saveSettings()" [disabled]="saving">{{ saving ? 'Saving…' : 'Save Settings' }}</button></div>
            <div class="form-grid">
              <label><span>Trial enabled</span><input type="checkbox" [(ngModel)]="settings.trialEnabled"></label>
              <label><span>Trial days</span><input type="number" min="1" max="365" [(ngModel)]="settings.trialDays"></label>
              <label><span>Grace period hours</span><input type="number" min="0" max="168" [(ngModel)]="settings.gracePeriodHours"></label>
            </div>
          </article>

          @for (key of planKeys; track key) {
            <article class="bt-card panel">
              <div class="plan-head"><div><span class="plan-eyebrow">PLAN</span><h2>{{ key | titlecase }}</h2></div><label class="switch"><input type="checkbox" [(ngModel)]="settings.plans[key].enabled"><span></span></label></div>
              <label class="field"><span>Price (INR)</span><input type="number" min="0" [disabled]="key === 'custom'" [(ngModel)]="settings.plans[key].price" [placeholder]="key === 'custom' ? 'Custom' : 'Price'"></label>
              <label class="field"><span>Billing cycle</span><select [(ngModel)]="settings.plans[key].billingCycle"><option value="monthly">Monthly</option><option value="halfYearly">Half-Yearly</option><option value="yearly">Yearly</option><option value="custom">Custom</option></select></label>
            </article>
          }
        </section>
      }

      <section class="bt-card panel payments-panel">
        <div class="panel-head"><div><h2>Payment records</h2><p>Gateway-ready payment lifecycle for all businesses.</p></div><select [(ngModel)]="statusFilter" (change)="loadPayments()"><option value="">All statuses</option><option value="pending">Pending</option><option value="processing">Processing</option><option value="success">Success</option><option value="failed">Failed</option><option value="cancelled">Cancelled</option><option value="refunded">Refunded</option></select></div>
        @if (paymentsLoading) { <p class="bt-muted">Loading payments…</p> }
        @else if (!payments.length) { <p class="bt-muted">No payments found.</p> }
        @else {
          <div class="payment-table">
            <div class="table-row table-head"><span>Payment</span><span>Business</span><span>Plan</span><span>Amount</span><span>Status</span><span>Date</span></div>
            @for (payment of payments; track payment.paymentId) {
              <div class="table-row">
                <span><strong>{{ payment.paymentId }}</strong><small>{{ payment.gateway || 'Gateway pending' }}</small></span>
                <span class="mono">{{ payment.businessId }}</span>
                <span>{{ payment.plan | titlecase }} · {{ payment.billingCycle | titlecase }}</span>
                <strong>₹{{ payment.amount }}</strong>
                <span class="status" [class]="'status-' + payment.status">{{ payment.status | titlecase }}</span>
                <span>{{ payment.createdAt | date:'short' }}</span>
              </div>
            }
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .admin-subscription-page{max-width:1600px}.settings-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.panel{padding:20px}.wide{grid-column:1/-1}.panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px}.panel-head h2{margin:0;font-size:17px}.panel-head p{margin:5px 0 0;color:#667085;font-size:12px}.form-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.form-grid label,.field{display:grid;gap:7px;color:#475467;font-size:12px;font-weight:700}.form-grid input[type=number],.field input,.field select,.panel-head select{min-height:42px;border:1px solid #d0d5dd;border-radius:10px;padding:0 12px;background:#fff;color:#101828}.form-grid label{padding:12px;border:1px solid #eaecf0;border-radius:12px}.form-grid input[type=checkbox]{width:18px;height:18px}.plan-head{display:flex;justify-content:space-between;gap:10px;margin-bottom:18px}.plan-eyebrow{font-size:9px;font-weight:800;letter-spacing:.1em;color:#667085}.plan-head h2{margin:3px 0 0;font-size:18px}.field{margin-top:13px}.switch input{display:none}.switch span{display:block;width:42px;height:24px;border-radius:999px;background:#d0d5dd;position:relative;cursor:pointer}.switch span:after{content:'';position:absolute;width:18px;height:18px;top:3px;left:3px;border-radius:50%;background:#fff;transition:.2s}.switch input:checked+span{background:#2563eb}.switch input:checked+span:after{left:21px}.payments-panel{margin-top:18px}.payment-table{overflow:auto}.table-row{min-width:980px;display:grid;grid-template-columns:1.5fr 1.3fr .9fr .7fr .8fr .9fr;gap:12px;align-items:center;padding:12px 0;border-top:1px solid #eaecf0;font-size:12px}.table-head{border-top:0;color:#667085;font-weight:800}.table-row small{display:block;margin-top:3px;color:#98a2b3}.mono{font-family:monospace;font-size:10px}.status{display:inline-flex;width:max-content;padding:4px 8px;border-radius:999px;font-size:10px;font-weight:800;text-transform:uppercase}.status-pending{background:#fff7ed;color:#c2410c}.status-processing{background:#eff6ff;color:#1d4ed8}.status-success{background:#ecfdf3;color:#15803d}.status-failed{background:#fef2f2;color:#b91c1c}.status-cancelled{background:#f2f4f7;color:#475467}.status-refunded{background:#f5f3ff;color:#6d28d9}.error-box,.success-box{padding:12px 14px;border-radius:12px;margin-bottom:14px}.error-box{border:1px solid #fecdca;background:#fef3f2;color:#b42318}.success-box{border:1px solid #abefc6;background:#ecfdf3;color:#067647}@media(max-width:1000px){.settings-grid{grid-template-columns:1fr 1fr}.wide{grid-column:1/-1}.form-grid{grid-template-columns:1fr}}@media(max-width:650px){.settings-grid{grid-template-columns:1fr}.panel-head{display:block}.panel-head button,.panel-head select{margin-top:12px}.panel-head button{width:100%}}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSubscriptionPaymentComponent implements OnInit {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly paymentService = inject(PaymentService);

  settings: SubscriptionSettings | null = null;
  readonly planKeys = ['basic', 'premium', 'custom'] as const;
  payments: PaymentRecord[] = [];
  statusFilter: PaymentStatus | '' = '';
  loading = true;
  saving = false;
  paymentsLoading = false;
  error = '';
  success = '';

  ngOnInit(): void { this.loadAll(); }

  loadAll(): void {
    this.error = '';
    this.success = '';
    this.loading = true;
    this.subscriptionService.getAdminSettings().pipe(finalize(() => (this.loading = false))).subscribe({
      next: (settings) => (this.settings = settings),
      error: (err) => (this.error = err?.error?.message || 'Could not load subscription settings.'),
    });
    this.loadPayments();
  }

  loadPayments(): void {
    this.paymentsLoading = true;
    this.paymentService.listAdminPayments(this.statusFilter || undefined).pipe(finalize(() => (this.paymentsLoading = false))).subscribe({
      next: (payments) => {
        this.payments = payments;
      },
      error: (err) => (this.error = err?.error?.message || 'Could not load payments.'),
    });
  }

  saveSettings(): void {
    if (!this.settings || this.saving) return;
    this.saving = true;
    this.error = '';
    this.success = '';
    const payload = {
      trialEnabled: this.settings.trialEnabled,
      trialDays: Number(this.settings.trialDays),
      gracePeriodHours: Number(this.settings.gracePeriodHours),
      plans: {
        basic: { ...this.settings.plans.basic, price: this.settings.plans.basic.price === null ? null : Number(this.settings.plans.basic.price) },
        premium: { ...this.settings.plans.premium, price: this.settings.plans.premium.price === null ? null : Number(this.settings.plans.premium.price) },
        custom: { ...this.settings.plans.custom, price: this.settings.plans.custom.price === null ? null : Number(this.settings.plans.custom.price) },
      },
    };
    this.subscriptionService.updateAdminSettings(payload).pipe(finalize(() => (this.saving = false))).subscribe({
      next: (settings) => { this.settings = settings; this.success = 'Subscription settings saved successfully.'; },
      error: (err) => (this.error = err?.error?.message || 'Could not save settings.'),
    });
  }
}
