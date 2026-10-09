
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { SubscriptionService } from '../core/subscription.service';
import { PaymentService } from '../payment/services/payment.service';
import { PaymentRecord } from '../payment/models/payment.model';

type BillingCycle = 'monthly' | 'halfYearly' | 'yearly' | 'custom';
type PlanId = 'basic' | 'premium' | 'custom';

interface BillingPrice {
  baseAmount?: number;
  actualAmount?: number;
  discountPercentage?: number;
  enabled?: boolean;
}

interface RawPlanSetting {
  enabled?: boolean;
  price?: number | null;
  billingCycle?: BillingCycle;
  billing?: Partial<Record<BillingCycle, BillingPrice>>;
}

interface PlanSetting {
  enabled: boolean;
  billingCycle: BillingCycle;
  price: number | null;
}

interface PricingPlan {
  id: PlanId;
  name: string;
  setting: PlanSetting;
  description: string;
  features: string[];
  popular?: boolean;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    DatePipe,
    DecimalPipe,
    TitleCasePipe,
  ],
  templateUrl: './pricing.page.html',
  styleUrl: './pricing.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingPage implements OnInit {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly paymentService = inject(PaymentService);
  private readonly cdr = inject(ChangeDetectorRef);

  billingCycle: BillingCycle = 'monthly';
  plans: PricingPlan[] = [];
  current: any = null;

  loading = true;
  paymentLoading = false;
  error = '';
  success = '';
  payment: PaymentRecord | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.success = '';
    this.cdr.markForCheck();

    this.subscriptionService
      .getMe()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response: any) => {
          try {
            const data = response?.data ?? response;

            if (!data?.plans) {
              throw new Error(
                'Subscription plan settings were not returned by the server.'
              );
            }

            const settings = data.plans as Record<
              PlanId,
              RawPlanSetting | undefined
            >;

            if (!settings.basic || !settings.premium || !settings.custom) {
              throw new Error(
                'Basic, Premium or Custom plan settings are missing.'
              );
            }

            this.current = data;

            this.buildPlans({
              basic: settings.basic,
              premium: settings.premium,
              custom: settings.custom,
            });

            this.setBillingCycle('monthly');
          } catch (err) {
            this.plans = [];
            this.error =
              err instanceof Error
                ? err.message
                : 'Could not read subscription plan settings.';
          }

          this.cdr.markForCheck();
        },
        error: (err) => {
          this.plans = [];
          this.error =
            err?.error?.message ||
            'Could not load subscription plans. Please try again.';
          this.cdr.markForCheck();
        },
      });
  }

  private buildPlans(settings: Record<PlanId, RawPlanSetting>): void {
    this.plans = [
      {
        id: 'basic',
        name: 'Basic',
        setting: this.normalizePlan(settings.basic),
        description:
          'Essential tools for managing and growing your business.',
        features: [
          'Dashboard',
          'Customer management',
          'Campaigns',
          'Broadcast',
          'Social publishing',
          'Communication wallet',
          'Payment history',
          'Invoice',
          'Support',
        ],
      },
      {
        id: 'premium',
        name: 'Premium',
        setting: this.normalizePlan(settings.premium),
        description:
          'Advanced tools and analytics for growing businesses.',
        popular: true,
        features: [
          'Everything in Basic',
          'Advanced analytics',
          'All social tools',
          'Advanced communication',
          'Scheduling tools',
          'Priority features',
        ],
      },
      {
        id: 'custom',
        name: 'Custom',
        setting: this.normalizePlan(settings.custom),
        description:
          'Flexible configuration for businesses with custom requirements.',
        features: [
          'Custom requirements',
          'Custom limits',
          'Custom integrations',
          'Custom features',
          'Business-specific configuration',
        ],
      },
    ];
  }

  private normalizePlan(raw: RawPlanSetting): PlanSetting {
    return {
      enabled: raw.enabled ?? true,
      billingCycle: raw.billingCycle ?? 'monthly',
      price: null,
    };
  }

  private rawPlan(planId: PlanId): RawPlanSetting | undefined {
    return this.current?.plans?.[planId] as
      | RawPlanSetting
      | undefined;
  }

  getBilling(plan: PricingPlan): BillingPrice | null {
    return (
      this.rawPlan(plan.id)?.billing?.[this.billingCycle] ?? null
    );
  }

  /**
   * actualAmount is the payable/current price.
   * baseAmount is the comparison/original price.
   */
  getPrice(plan: PricingPlan): number | null {
    if (plan.id === 'custom') {
      return null;
    }

    const billing = this.getBilling(plan);

    if (!billing || billing.enabled === false) {
      return null;
    }

    const amount = billing.baseAmount;

    if (
      amount === undefined ||
      amount === null ||
      !Number.isFinite(Number(amount))
    ) {
      return null;
    }

    return Number(amount);
  }

  getActualAmount(plan: PricingPlan): number | null {
    if (plan.id === 'custom') {
      return null;
    }

    const billing = this.getBilling(plan);

    if (!billing || billing.enabled === false) {
      return null;
    }

    const amount = billing.actualAmount;

    if (
      amount === undefined ||
      amount === null ||
      !Number.isFinite(Number(amount))
    ) {
      return null;
    }

    return Number(amount);
  }

  getDiscountPercentage(plan: PricingPlan): number {
    const value = Number(
      this.getBilling(plan)?.discountPercentage ?? 0
    );

    return Number.isFinite(value) ? value : 0;
  }

  showDiscount(plan: PricingPlan): boolean {
    return (
      this.getPrice(plan) !== null &&
      this.getActualAmount(plan) !== null &&
      this.getDiscountPercentage(plan) > 0
    );
  }

  setBillingCycle(cycle: BillingCycle): void {
    this.billingCycle = cycle;

    this.plans = this.plans.map((plan) => ({
      ...plan,
      setting: {
        ...plan.setting,
        billingCycle: cycle,
        price: this.getPriceForCycle(plan.id, cycle),
      },
    }));

    this.cdr.markForCheck();
  }

  private getPriceForCycle(
    planId: PlanId,
    cycle: BillingCycle
  ): number | null {
    if (planId === 'custom') {
      return null;
    }

    const plan = this.rawPlan(planId);
    const billing = plan?.billing?.[cycle];

    if (!plan || !billing || billing.enabled === false) {
      return null;
    }

    const amount = billing.baseAmount;

    return amount !== undefined &&
      amount !== null &&
      Number.isFinite(Number(amount))
      ? Number(amount)
      : null;
  }

  getPeriodLabel(): string {
    switch (this.billingCycle) {
      case 'monthly':
        return 'month';
      case 'halfYearly':
        return '6 months';
      case 'yearly':
        return 'year';
      default:
        return '';
    }
  }

  isBillingEnabled(plan: PricingPlan): boolean {
    if (plan.id === 'custom') {
      return plan.setting.enabled;
    }

    const billing = this.getBilling(plan);
    const price = this.getPrice(plan);

    return (
      plan.setting.enabled &&
      billing?.enabled !== false &&
      price !== null &&
      price > 0
    );
  }

  isCurrent(plan: PricingPlan): boolean {
    const currentPlanName = String(
      this.current?.subscription?.planName ??
        this.current?.subscription?.plan ??
        ''
    ).toLowerCase();

    return currentPlanName === plan.name.toLowerCase();
  }

  getCurrentPlanName(): string {
    const subscription = this.current?.subscription;

    if (!subscription) {
      return 'No Plan';
    }

    return subscription.planName || subscription.plan || 'No Plan';
  }

  getSubscriptionStatus(): string {
    return String(
      this.current?.subscription?.status ??
        this.current?.status ??
        'Unknown'
    );
  }

  getTrialEndDate(): string | Date | null {
    return (
      this.current?.subscription?.trialEndsAt ??
      this.current?.subscription?.expiresAt ??
      this.current?.subscription?.activeUntil ??
      null
    );
  }

  isTrial(): boolean {
    const subscription = this.current?.subscription;
    const planName = String(
      subscription?.planName ?? ''
    ).toLowerCase();
    const status = String(
      subscription?.status ?? this.current?.status ?? ''
    ).toLowerCase();

    return (
      planName.includes('trial') ||
      status === 'trial' ||
      Boolean(subscription?.trialEndsAt && !subscription?.expiresAt)
    );
  }

  selectPlan(plan: PricingPlan): void {
    this.error = '';
    this.success = '';

    if (!plan.setting.enabled) {
      this.error = 'This plan is currently unavailable.';
      return;
    }

    if (plan.id === 'custom') {
      this.error =
        'Please contact support to configure a Custom plan.';
      return;
    }

    if (!this.isBillingEnabled(plan)) {
      this.error = 'This billing period is currently unavailable.';
      return;
    }

    this.paymentLoading = true;
    this.cdr.markForCheck();

    this.paymentService
      .createPayment({
        plan: plan.id,
        billingCycle: this.billingCycle,
        metadata: { source: 'pricing-page' },
      })
      .pipe(
        finalize(() => {
          this.paymentLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (payment) => {
          this.payment = payment;
          this.success = 'Payment request created successfully.';
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error =
            err?.error?.message ||
            'Could not create payment request.';
          this.cdr.markForCheck();
        },
      });
  }

  closePayment(): void {
    this.payment = null;
    this.cdr.markForCheck();
  }

  paymentLabel(payment: PaymentRecord): string {
    return this.paymentService.getPaymentLabel(payment.plan);
  }

  billingLabel(payment: PaymentRecord): string {
    return this.paymentService.getBillingLabel(
      payment.billingCycle
    );
  }

  statusLabel(status: string): string {
    return status.replace(/_/g, ' ');
  }
}
