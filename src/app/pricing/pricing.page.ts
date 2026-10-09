import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import {
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import {
  SubscriptionService,
  PlanSetting,
  SubscriptionMeResponse,
} from '../core/subscription.service';

import { PaymentService } from '../payment/services/payment.service';
import { PaymentRecord } from '../payment/models/payment.model';

import { finalize } from 'rxjs';


type BillingCycle =
  | 'monthly'
  | 'halfYearly'
  | 'yearly'
  | 'custom';

type PlanId =
  | 'basic'
  | 'premium'
  | 'custom';


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

  private readonly subscriptionService =
    inject(SubscriptionService);

  private readonly paymentService =
    inject(PaymentService);


  billingCycle: BillingCycle = 'monthly';

  plans: PricingPlan[] = [];

  current: SubscriptionMeResponse | null = null;

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

    this.subscriptionService
      .getMe()

      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )

      .subscribe({

        next: (response) => {

          this.current = response;

          this.buildPlans(response.plans);

          this.billingCycle =
            this.initialCycle(response.plans);
        },

        error: (err) => {

          this.error =
            err?.error?.message ||
            'Could not load subscription plans.';
        },

      });
  }


  private buildPlans(
    settings: SubscriptionMeResponse['plans']
  ): void {

    this.plans = [

      {
        id: 'basic',

        name: 'Basic',

        setting: settings.basic,

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

        setting: settings.premium,

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

        setting: settings.custom,

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


  private initialCycle(
    settings: SubscriptionMeResponse['plans']
  ): BillingCycle {

    if (
      settings.basic.enabled &&
      settings.basic.billingCycle !== 'custom'
    ) {
      return settings.basic.billingCycle;
    }


    if (
      settings.premium.enabled &&
      settings.premium.billingCycle !== 'custom'
    ) {
      return settings.premium.billingCycle;
    }


    return 'monthly';
  }


  setBillingCycle(
    cycle: BillingCycle
  ): void {

    if (cycle === 'custom') {
      return;
    }

    this.billingCycle = cycle;

    this.error = '';

    this.success = '';
  }


  getPrice(
    plan: PricingPlan
  ): number | null {

    if (plan.id === 'custom') {
      return null;
    }

    /*
     * Current backend returns:
     *
     * {
     *   enabled: boolean,
     *   price: number | null,
     *   billingCycle: BillingCycle
     * }
     *
     * Therefore the currently configured admin price
     * is returned here.
     *
     * When backend billing becomes:
     *
     * billing: {
     *   monthly: { price },
     *   halfYearly: { price },
     *   yearly: { price }
     * }
     *
     * this method should read the selected cycle price.
     */

    return plan.setting.price;
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


  isCurrent(
    plan: PricingPlan
  ): boolean {

    return (
      this.current?.subscription?.plan === plan.id &&
      this.current.status !== 'expired'
    );
  }


  selectPlan(
    plan: PricingPlan
  ): void {

    this.error = '';

    this.success = '';


    if (!plan.setting.enabled) {
      return;
    }


    if (plan.id === 'custom') {

      this.error =
        'Custom plan is configured by the administrator. Please contact support.';

      return;
    }


    if (this.billingCycle === 'custom') {

      this.error =
        'Please select a valid billing cycle.';

      return;
    }


    const price =
      this.getPrice(plan);


    if (
      price === null ||
      price <= 0
    ) {

      this.error =
        'This plan is not currently purchasable.';

      return;
    }


    this.paymentLoading = true;


    this.paymentService

      .createPayment({

        plan: plan.id,

        billingCycle:
          this.billingCycle,

        metadata: {
          source: 'pricing-page',
        },

      })

      .pipe(

        finalize(() => {
          this.paymentLoading = false;
        })

      )

      .subscribe({

        next: (payment) => {

          this.payment = payment;

          this.success =
            'Payment request created. Continue with the configured payment gateway.';
        },


        error: (err) => {

          this.error =
            err?.error?.message ||
            'Could not create payment request.';
        },

      });
  }


  closePayment(): void {

    this.payment = null;

  }


  paymentLabel(
    payment: PaymentRecord
  ): string {

    return this.paymentService
      .getPaymentLabel(payment.plan);
  }


  billingLabel(
    payment: PaymentRecord
  ): string {

    return this.paymentService
      .getBillingLabel(payment.billingCycle);
  }


  statusLabel(
    status: string
  ): string {

    return status.replace(
      /_/g,
      ' '
    );
  }

}