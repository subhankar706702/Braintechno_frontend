import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';

export type SubscriptionPlan =
  | 'trial'
  | 'basic'
  | 'premium'
  | 'custom';

export type BillingCycle =
  | 'trial'
  | 'monthly'
  | 'halfYearly'
  | 'yearly'
  | 'custom';

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'expired'
  | 'cancelled'
  | 'missing';

export interface BillingPriceSetting {
  baseAmount: number;
  actualAmount: number;
  discountPercentage: number;
  enabled: boolean;
}

export interface PlanBillingSettings {
  monthly: BillingPriceSetting;
  halfYearly: BillingPriceSetting;
  yearly: BillingPriceSetting;
}

export interface PlanSetting {
  enabled: boolean;
  billing: PlanBillingSettings;
}

export interface SubscriptionPlans {
  basic: PlanSetting;
  premium: PlanSetting;
  custom: PlanSetting;
}

export interface SubscriptionSettings {
  key: 'global';
  trialEnabled: boolean;
  trialDays: number;
  gracePeriodHours: number;
  plans: SubscriptionPlans;
}

export interface SubscriptionRecord {
  businessId: string;
  accountId: string;
  plan: SubscriptionPlan;
  isCustom: boolean;
  billingCycle: BillingCycle;
  priceSnapshot: number;
  trialStartedAt: string | null;
  trialEndsAt: string | null;
  trialUsedAt: string | null;
  startsAt: string | null;
  expiresAt: string | null;
  pageAccessUntil: string | null;
  status: 'trialing' | 'active' | 'expired' | 'cancelled';
  previousPlan: SubscriptionPlan | null;
}

export interface SubscriptionPermissions {
  plan: SubscriptionPlan;
  features: Record<string, boolean>;
}

export interface SubscriptionMeResponse {
  subscription: SubscriptionRecord | null;
  status: SubscriptionStatus;
  pageAccess: boolean;
  pageAccessUntil: string | null;
  gracePeriod: boolean;
  permissions: SubscriptionPermissions | null;
  plans: SubscriptionPlans;
}

export interface SubscriptionPlansResponse {
  plans: SubscriptionPlans;
}

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private readonly http = inject(HttpClient);

  getPlans(): Observable<SubscriptionPlansResponse> {
    return this.http.get<SubscriptionPlansResponse>(
      `${API_BASE_URL}/subscription/plans`
    );
  }

  getMe(): Observable<SubscriptionMeResponse> {
    return this.http.get<SubscriptionMeResponse>(
      `${API_BASE_URL}/subscription/me`
    );
  }

  startTrial(): Observable<SubscriptionRecord> {
    return this.http.post<SubscriptionRecord>(
      `${API_BASE_URL}/subscription/trial`,
      {}
    );
  }

  getAdminSettings(): Observable<SubscriptionSettings> {
    return this.http.get<SubscriptionSettings>(
      `${API_BASE_URL}/subscription/admin/settings`
    );
  }

  updateAdminSettings(
    patch: Partial<SubscriptionSettings>
  ): Observable<SubscriptionSettings> {
    return this.http.patch<SubscriptionSettings>(
      `${API_BASE_URL}/subscription/admin/settings`,
      patch
    );
  }
}