import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../core/auth.service';
import { CustomerApiService } from '../core/customer-api.service';
import { Campaign } from '../core/models';
import { TemplateApiService } from '../core/template-api.service';
import {
  BusinessProfileResponse,
  BusinessProfileService,
} from './business-profile/business-profile.service';

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

type PerformanceMetric = 'views' | 'enquiries' | 'whatsapp';

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
    { label: '17 Sep', views: 620, enquiries: 180, whatsapp: 95 },
    { label: '18 Sep', views: 910, enquiries: 310, whatsapp: 160 },
    { label: '19 Sep', views: 1080, enquiries: 390, whatsapp: 220 },
    { label: '20 Sep', views: 860, enquiries: 300, whatsapp: 190 },
    { label: '21 Sep', views: 1210, enquiries: 520, whatsapp: 310 },
    { label: '22 Sep', views: 1390, enquiries: 690, whatsapp: 390 },
    { label: '23 Sep', views: 1710, enquiries: 1010, whatsapp: 540 },
    { label: '24 Sep', views: 1690, enquiries: 1120, whatsapp: 530 },
  ];

  constructor(
    private readonly router: Router,
    private readonly auth: AuthService,
    private readonly profileApi: BusinessProfileService,
    private readonly campaignApi: TemplateApiService,
    private readonly customerApi: CustomerApiService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadCampaigns();
    this.loadCustomers();
  }

  private loadProfile(): void {
    this.profileApi
      .getProfile()
      .pipe(catchError(() => of(null)))
      .subscribe((profile) => {
        this.businessProfile = profile;
        this.cdr.detectChanges();
      });
  }

  private loadCampaigns(): void {
    this.campaignApi
      .listCampaigns()
      .pipe(catchError(() => of([] as Campaign[])))
      .subscribe((campaigns) => {
        this.campaigns = Array.isArray(campaigns) ? campaigns : [];
        this.cdr.detectChanges();
      });
  }

  private loadCustomers(): void {
    const accountId = this.auth.user()?.accountId;

    if (!accountId) {
      this.totalCustomers = 0;
      return;
    }

    this.customerApi
      .list({
        accountId,
        page: 1,
        limit: 1,
        sort: 'newest',
      })
      .pipe(catchError(() => of(null)))
      .subscribe((customers) => {
        this.totalCustomers =
          Number(customers?.counts?.total) ||
          Number(customers?.meta?.total) ||
          0;
        this.cdr.detectChanges();
      });
  }

  get greetingName(): string {
    const owner =
      this.businessProfile?.account?.ownerName ||
      this.auth.user()?.name ||
      'there';

    return owner.trim().split(/\s+/)[0] || 'there';
  }

  get businessName(): string {
    return (
      this.businessProfile?.account?.businessName ||
      this.auth.user()?.businessName ||
      'Your Business'
    );
  }

  get businessCategory(): string {
    return this.businessProfile?.account?.businessCategory || 'Business';
  }

  get businessSlug(): string {
    return this.businessProfile?.account?.businessSlug || '';
  }

  get businessLogo(): string {
    return String(this.businessProfile?.profile?.businessLogo || '').trim();
  }

  get coverImage(): string {
    return String(this.businessProfile?.profile?.coverImage || '').trim();
  }

  get coverImageStyle(): string | null {
    return this.coverImage ? `url("${this.coverImage}")` : null;
  }

  get themePrimary(): string {
    return this.validHex(
      this.businessProfile?.profile?.brandColors?.primary,
      '#ff4d6d',
    );
  }

  get themeSecondary(): string {
    return this.validHex(
      this.businessProfile?.profile?.brandColors?.secondary,
      '#38bdf8',
    );
  }

  private validHex(value: unknown, fallback: string): string {
    const color = String(value || '').trim();
    return /^#[0-9a-fA-F]{6}$/.test(color) ? color : fallback;
  }

  get businessInitials(): string {
    const words = this.businessName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return (
      words
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join('') || 'B'
    );
  }

  get businessContact(): string {
    return (
      this.businessProfile?.profile?.businessMobileNumber ||
      this.businessProfile?.account?.ownerMobileNumber ||
      ''
    );
  }

  get whatsappNumber(): string {
    return String(
      this.businessProfile?.profile?.businessWhatsAppNumber || '',
    ).trim();
  }

  get whatsappUrl(): string {
    const digits = this.whatsappNumber.replace(/\D/g, '');
    return digits ? `https://wa.me/${digits}` : '';
  }

  get phoneUrl(): string {
    const phone = this.businessContact.replace(/\s+/g, '');
    return phone ? `tel:${phone}` : '';
  }

  get googleMapsUrl(): string {
    return String(
      this.businessProfile?.profile?.googleMapsUrl || '',
    ).trim();
  }

  get facebookUrl(): string {
    return this.normalizeUrl(
      this.businessProfile?.profile?.socialLinks?.facebook,
    );
  }

  get instagramUrl(): string {
    return this.normalizeUrl(
      this.businessProfile?.profile?.socialLinks?.instagram,
    );
  }

  get youtubeUrl(): string {
    return this.normalizeUrl(
      this.businessProfile?.profile?.socialLinks?.youtube,
    );
  }

  get websiteUrl(): string {
    return this.normalizeUrl(
      this.businessProfile?.profile?.socialLinks?.website,
    );
  }

  private normalizeUrl(value: unknown): string {
    const url = String(value || '').trim();

    if (!url) {
      return '';
    }

    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    return `https://${url}`;
  }

  get profileCompletion(): number {
    return Number(
      this.businessProfile?.profile?.profileCompletion || 0,
    );
  }

  get profileLocation(): string {
    const profile = this.businessProfile?.profile;
    const parts = [profile?.city, profile?.state].filter(Boolean);
    return parts.length ? parts.join(', ') : 'Add business location';
  }

  get publicUrl(): string {
    const slug = this.businessSlug;
    return slug
      ? `www.braintechno.com/${slug}`
      : 'Public page not ready';
  }

  get publicPageUrl(): string {
    return this.businessSlug
      ? `https://www.braintechno.com/${this.businessSlug}`
      : '';
  }

  get currentCampaign(): Campaign | null {
    return (
      this.campaigns.find((item) => item.status === 'published') ||
      this.campaigns[0] ||
      null
    );
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
      if (!item.endAt || item.status !== 'published') {
        return false;
      }

      const time = new Date(item.endAt).getTime();
      return (
        Number.isFinite(time) &&
        time > now &&
        time - now <= sevenDays
      );
    }).length;
  }

  get stats(): DashboardStat[] {
    return [
      {
        icon: 'campaign',
        label: 'Total Campaigns',
        value: this.totalCampaigns,
        change: 'Your published & draft pages',
        tone: 'pink',
      },
      {
        icon: 'group',
        label: 'Total Customers',
        value: this.totalCustomers,
        change: 'Saved customer contacts',
        tone: 'green',
      },
      {
        icon: 'forum',
        label: 'New Enquiries',
        value: 0,
        change: 'Connect enquiry tracking next',
        tone: 'blue',
      },
      {
        icon: 'schedule',
        label: 'Expiring Soon',
        value: this.expiringSoon,
        change: 'Within the next 7 days',
        tone: 'amber',
      },
    ];
  }

  get currentDateLabel(): string {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date());
  }

  linePoints(metric: PerformanceMetric): string {
    const maxValue = Math.max(
      1,
      ...this.performance.flatMap((point) => [
        point.views,
        point.enquiries,
        point.whatsapp,
      ]),
    );

    const width = 700;
    const height = 190;
    const paddingX = 12;
    const paddingY = 14;
    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingY * 2;

    return this.performance
      .map((point, index) => {
        const x =
          paddingX +
          (usableWidth * index) /
            Math.max(1, this.performance.length - 1);
        const y =
          paddingY +
          usableHeight -
          (point[metric] / maxValue) * usableHeight;

        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  linePointX(index: number): number {
    const width = 700;
    const paddingX = 12;
    const usableWidth = width - paddingX * 2;

    return (
      paddingX +
      (usableWidth * index) /
        Math.max(1, this.performance.length - 1)
    );
  }

  linePointY(
    point: PerformancePoint,
    metric: PerformanceMetric,
  ): number {
    const maxValue = Math.max(
      1,
      ...this.performance.flatMap((item) => [
        item.views,
        item.enquiries,
        item.whatsapp,
      ]),
    );

    const height = 190;
    const paddingY = 14;
    const usableHeight = height - paddingY * 2;

    return (
      paddingY +
      usableHeight -
      (point[metric] / maxValue) * usableHeight
    );
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
