import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../core/auth.service';

import { CustomerApiService } from '../core/customer-api.service';
import { Campaign } from '../core/models';
import { TemplateApiService } from '../core/template-api.service';
import { BusinessProfileResponse, BusinessProfileService } from './business-profile/business-profile.service';

type DashboardStat = {
  icon: string;
  label: string;
  value: number;
  change: string;
  tone: 'pink' | 'green' | 'blue' | 'amber';
};

type PerformancePoint = {
  label: string;
  views: number;
  enquiries: number;
  whatsapp: number;
};

@Component({
  selector: 'bt-dashboard-page',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage implements OnInit {
  businessProfile: BusinessProfileResponse | null = null;
  campaigns: Campaign[] = [];
  totalCustomers = 0;

  readonly performance: PerformancePoint[] = [
    { label: '17 Sep', views: 31, enquiries: 18, whatsapp: 10 },
    { label: '18 Sep', views: 48, enquiries: 27, whatsapp: 15 },
    { label: '19 Sep', views: 56, enquiries: 34, whatsapp: 19 },
    { label: '20 Sep', views: 46, enquiries: 25, whatsapp: 16 },
    { label: '21 Sep', views: 63, enquiries: 41, whatsapp: 25 },
    { label: '22 Sep', views: 73, enquiries: 49, whatsapp: 32 },
    { label: '23 Sep', views: 91, enquiries: 67, whatsapp: 42 },
    { label: '24 Sep', views: 91, enquiries: 74, whatsapp: 42 },
  ];

  constructor(
    private readonly router: Router,
    private readonly auth: AuthService,
    private readonly profileApi: BusinessProfileService,
    private readonly campaignApi: TemplateApiService,
    private readonly customerApi: CustomerApiService,
  ) {}

  ngOnInit(): void {
    const accountId = this.auth.user()?.accountId;

    forkJoin({
      profile: this.profileApi.getProfile().pipe(catchError(() => of(null))),
      campaigns: this.campaignApi.listCampaigns().pipe(catchError(() => of([] as Campaign[]))),
      customers: accountId
        ? this.customerApi.list({ accountId, page: 1, limit: 1, sort: 'newest' }).pipe(catchError(() => of(null)))
        : of(null),
    }).subscribe(({ profile, campaigns, customers }) => {
      this.businessProfile = profile;
      this.campaigns = campaigns;
      this.totalCustomers = customers?.counts?.total || customers?.meta?.total || 0;
    });
  }

  get greetingName(): string {
    const owner = this.businessProfile?.account.ownerName || this.auth.user()?.name || 'there';
    return owner.trim().split(/\s+/)[0] || 'there';
  }

  get businessName(): string {
    return this.businessProfile?.account.businessName || this.auth.user()?.businessName || 'Your Business';
  }

  get businessCategory(): string {
    return this.businessProfile?.account.businessCategory || 'Business';
  }

  get businessLogo(): string {
    return this.businessProfile?.profile.businessLogo || '';
  }

  get businessInitials(): string {
    const words = this.businessName.trim().split(/\s+/).filter(Boolean);
    return words.slice(0, 2).map((word) => word.charAt(0).toUpperCase()).join('') || 'B';
  }

  get businessContact(): string {
    return this.businessProfile?.profile.businessMobileNumber || this.businessProfile?.account.ownerMobileNumber || 'Add contact number';
  }

  get whatsappNumber(): string {
    return this.businessProfile?.profile.businessWhatsAppNumber || '';
  }

  get profileCompletion(): number {
    return this.businessProfile?.profile.profileCompletion || 0;
  }

  get profileLocation(): string {
    const profile = this.businessProfile?.profile;
    const parts = [profile?.city, profile?.state].filter(Boolean);
    return parts.length ? parts.join(', ') : 'Add business location';
  }

  get publicUrl(): string {
    const slug = this.businessProfile?.account.businessSlug || '';
    return slug ? `www.braintechno.com/${slug}` : 'Public page not ready';
  }

  get currentCampaign(): Campaign | null {
    return this.campaigns.find((item) => item.status === 'published') || this.campaigns[0] || null;
  }

  get visibleCampaigns(): Campaign[] {
    return this.campaigns.slice(0, 4);
  }

  get totalCampaigns(): number {
    return this.campaigns.length;
  }

  get expiringSoon(): number {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return this.campaigns.filter((item) => {
      if (!item.endAt || item.status !== 'published') return false;
      const time = new Date(item.endAt).getTime();
      return Number.isFinite(time) && time > now && time - now <= sevenDays;
    }).length;
  }

  get stats(): DashboardStat[] {
    return [
      { icon: 'campaign', label: 'Total Campaigns', value: this.totalCampaigns, change: 'Your published & draft pages', tone: 'pink' },
      { icon: 'group', label: 'Total Customers', value: this.totalCustomers, change: 'Saved customer contacts', tone: 'green' },
      { icon: 'forum', label: 'New Enquiries', value: 0, change: 'Connect enquiry tracking next', tone: 'blue' },
      { icon: 'schedule', label: 'Expiring Soon', value: this.expiringSoon, change: 'Within the next 7 days', tone: 'amber' },
    ];
  }

  get currentDateLabel(): string {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date());
  }

  performanceHeight(value: number): string {
    return `${Math.max(8, Math.min(value, 100))}%`;
  }

  campaignStatusLabel(status: Campaign['status']): string {
    if (status === 'published') return 'Published';
    if (status === 'scheduled') return 'Scheduled';
    if (status === 'expired') return 'Expired';
    if (status === 'unpublished') return 'Unpublished';
    return 'Draft';
  }

  campaignDate(item: Campaign): string {
    const source = item.endAt || item.publishAt || item.createdAt;
    if (!source) return 'No date set';

    const date = new Date(source);
    if (Number.isNaN(date.getTime())) return 'No date set';

    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

  editProfile(): void {
    void this.router.navigateByUrl('/app/business-profile');
  }

  createCampaign(): void {
    void this.router.navigateByUrl('/app/campaigns');
  }

  viewCampaigns(): void {
    void this.router.navigateByUrl('/app/campaigns');
  }

  openCustomers(): void {
    void this.router.navigateByUrl('/app/customers');
  }
}
