import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, firstValueFrom } from 'rxjs';

import {
  Campaign,
  CampaignCategory,
  CampaignContext,
  CampaignStatus,
  TemplateDraft
} from '../core/models';
import { TemplateStorageService } from '../core/template-storage.service';
import { TemplateApiService } from '../core/template-api.service';
import { AuthService } from '../core/auth.service';
import { MaterialModule } from '../shared/material/material.module';
import { SnackbarService } from '../shared/material/notification/snackbar.service';

interface CampaignCategoryOption {
  value: CampaignCategory;
  label: string;
  description: string;
}

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [FormsModule, DatePipe, MaterialModule],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.scss'
})
export class CampaignsComponent implements OnInit {
  readonly publicDomain = 'https://www.braintechno.in';
  readonly blankTemplateId = '__blank__';

  readonly categoryOptions: CampaignCategoryOption[] = [
    {
      value: 'business_main_page',
      label: 'Business Main Web Page',
      description: 'Primary business page. Default validity is 10 years from creation date.'
    },
    {
      value: 'discount_offer',
      label: 'Discount Offer',
      description: 'Discount, coupon or price-based promotion.'
    },
    {
      value: 'festival_offer',
      label: 'Festival Offer',
      description: 'Festival or seasonal campaign page.'
    },
    {
      value: 'product_promotion',
      label: 'Product Promotion',
      description: 'Promote a product or collection.'
    },
    {
      value: 'service_promotion',
      label: 'Service Promotion',
      description: 'Promote one or more services.'
    },
    {
      value: 'event_promotion',
      label: 'Event Promotion',
      description: 'Promote a launch, event or activity.'
    },
    {
      value: 'limited_time_offer',
      label: 'Limited Time Offer',
      description: 'Short-term campaign with a custom validity.'
    },
    {
      value: 'other',
      label: 'Other Campaign',
      description: 'General campaign. If end date is blank, default validity becomes 1 year.'
    }
  ];

  templates: TemplateDraft[] = [];
  campaigns: Campaign[] = [];
  context: CampaignContext | null = null;

  name = '';
  pageSlug = '';
  category: CampaignCategory = 'other';
  templateId = '';
  description = '';

  publishMode: 'draft' | 'now' | 'schedule' = 'draft';
  scheduleAt = '';
  endAt = '';

  loading = false;
  loadingTemplates = false;
  loadingCampaigns = false;
  loadingContext = false;
  actionId = '';
  editingId = '';

  constructor(
    private storage: TemplateStorageService,
    private api: TemplateApiService,
    private auth: AuthService,
    private router: Router,
    private snackbar: SnackbarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadContext();
    void this.loadTemplates();
    this.loadCampaigns();
  }

  get accountId(): string | number | null {
    return this.auth.user()?.accountId ?? null;
  }

  get businessSlug(): string {
    return this.context?.businessSlug || '';
  }

  get slugValue(): string {
    return this.cleanSlug(this.pageSlug);
  }

  get pageUrlPreview(): string {
    const business = this.businessSlug || 'business-page';
    const slug = this.slugValue;

    if (!slug || slug === 'blank') {
      return `${this.publicDomain}/${business}`;
    }

    return `${this.publicDomain}/${business}/${slug}`;
  }

  get isBusinessMainPage(): boolean {
    return this.category === 'business_main_page';
  }

  get selectedCategoryDescription(): string {
    return this.categoryOptions.find((item) => item.value === this.category)?.description || '';
  }

  get isBlankTemplateSelected(): boolean {
    return this.templateId === this.blankTemplateId;
  }

  loadContext(): void {
    this.loadingContext = true;

    this.api
      .getCampaignContext()
      .pipe(
        finalize(() => {
          this.loadingContext = false;
          this.refreshView();
        })
      )
      .subscribe({
        next: (context) => {
          this.context = context;
          this.refreshView();
        },
        error: (error) => {
          console.error('Campaign context error:', error);
          this.context = null;
          this.snackbar.fromApiError(error, 'Could not load business page information.');
        }
      });
  }

  async loadTemplates(): Promise<void> {
    const accountId = this.accountId;

    if (accountId === null || accountId === undefined || accountId === '') {
      this.templates = [];
      this.snackbar.warning('Account ID is missing. Please login again.');
      this.refreshView();
      return;
    }

    this.loadingTemplates = true;
    this.refreshView();

    try {
      const result = await this.storage.list(accountId);
      this.templates = Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Failed to load templates:', error);
      this.templates = [];
      this.snackbar.fromApiError(error, 'Could not load templates.');
    } finally {
      this.loadingTemplates = false;
      this.refreshView();
    }
  }

  loadCampaigns(showSuccess = false): void {
    if (this.loadingCampaigns) {
      return;
    }

    this.loadingCampaigns = true;
    this.refreshView();

    this.api
      .listCampaigns()
      .pipe(
        finalize(() => {
          this.loadingCampaigns = false;
          this.refreshView();
        })
      )
      .subscribe({
        next: (items) => {
          this.campaigns = Array.isArray(items) ? items : [];
          if (showSuccess) {
            this.snackbar.success('Campaign list refreshed.');
          }
          this.refreshView();
        },
        error: (error) => {
          console.error('Campaign list error:', error);
          this.campaigns = [];
          this.snackbar.fromApiError(error, 'Could not load campaigns.');
        }
      });
  }

  async submitCampaign(): Promise<void> {
    if (this.loading) return;

    if (!this.businessSlug) {
      this.snackbar.warning('Business page information is not ready yet.');
      return;
    }

    const pageSlug = this.slugValue;
    const computedName = this.cleanName(this.name) || this.titleFromSlug(pageSlug);

    if (!pageSlug) {
      this.snackbar.warning('Page / URL slug is required. Use "blank" for the business root page.');
      return;
    }

    if (!this.templateId) {
      this.snackbar.warning('Please select a template.');
      return;
    }

    if (this.publishMode === 'schedule' && !this.scheduleAt && !this.editingId) {
      this.snackbar.warning('Select schedule date and time.');
      return;
    }

    if (this.publishMode === 'schedule' && this.scheduleAt && !this.toIso(this.scheduleAt)) {
      this.snackbar.warning('Invalid schedule date and time.');
      return;
    }

    this.loading = true;
    this.refreshView();

    try {
      if (this.editingId) {
        const updated = await firstValueFrom(
          this.api.updateCampaign(this.editingId, {
            name: computedName,
            category: this.category,
            description: this.description.trim(),
            endAt: this.isBusinessMainPage ? null : this.toIso(this.endAt)
          })
        );

        this.replaceCampaign(updated);
        this.resetForm();
        this.editingId = '';
        this.snackbar.success('Campaign updated successfully.');
        return;
      }

      const created = await firstValueFrom(
        this.api.createCampaign({
          name: computedName,
          pageSlug,
          category: this.category,
          templateId: this.templateId,
          useBlankTemplate: this.isBlankTemplateSelected,
          description: this.description.trim(),
          endAt: this.isBusinessMainPage ? null : this.toIso(this.endAt)
        })
      );

      let finalCampaign = created;
      let successMessage = 'Campaign draft created successfully.';

      if (this.publishMode === 'now') {
        finalCampaign = await firstValueFrom(
          this.api.publishCampaign(
            this.idOf(created),
            this.isBusinessMainPage ? null : this.toIso(this.endAt)
          )
        );
        successMessage = 'Campaign created and published successfully.';
      } else if (this.publishMode === 'schedule') {
        finalCampaign = await firstValueFrom(
          this.api.scheduleCampaign(
            this.idOf(created),
            this.toIso(this.scheduleAt) || '',
            this.isBusinessMainPage ? null : this.toIso(this.endAt)
          )
        );
        successMessage = 'Campaign created and scheduled successfully.';
      }

      this.campaigns = [
        finalCampaign,
        ...this.campaigns.filter((item) => this.idOf(item) !== this.idOf(finalCampaign))
      ];
      this.resetForm();
      this.snackbar.success(successMessage);
    } catch (error) {
      console.error('Campaign save error:', error);
      this.snackbar.fromApiError(error, 'Could not save campaign.');
    } finally {
      this.loading = false;
      this.refreshView();
    }
  }

  startEdit(campaign: Campaign): void {
    this.editingId = this.idOf(campaign);
    this.name = campaign.name || '';
    this.pageSlug = campaign.pageSlug || '';
    this.category = campaign.category || 'other';
    this.templateId = campaign.templateId || '';
    this.description = campaign.description || '';
    this.endAt = this.toInputDate(campaign.endAt);
    this.publishMode = 'draft';
    this.scheduleAt = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingId = '';
    this.resetForm();
  }

  viewSelectedTemplate(): void {
    if (!this.templateId) {
      this.snackbar.warning('Please select a template first.');
      return;
    }

    if (this.isBlankTemplateSelected) {
      this.snackbar.info('Blank template has no preview.');
      return;
    }

    void this.router.navigate(['/template', this.templateId, 'view'], {
      queryParams: {
        returnUrl: '/app/campaigns',
        mode: 'view'
      }
    });
  }

  openPublic(campaign: Campaign): void {
    const url = this.publicUrl(campaign);

    if (!url) {
      this.snackbar.warning('Public URL is not available.');
      return;
    }

    window.open(url, '_blank', 'noopener');
  }

  async copyPublicLink(campaign: Campaign): Promise<void> {
    const url = this.publicUrl(campaign);

    if (!url) {
      this.snackbar.warning('Public URL is not available.');
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        this.copyWithFallback(url);
      }
      this.snackbar.success('Campaign link copied.');
    } catch {
      this.copyWithFallback(url);
      this.snackbar.success('Campaign link copied.');
    }
  }

  async shareCampaign(campaign: Campaign): Promise<void> {
    const url = this.publicUrl(campaign);

    if (!url) {
      this.snackbar.warning('Public URL is not available.');
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: campaign.name,
          text: campaign.name,
          url
        });
        this.snackbar.success('Campaign link shared.');
        return;
      }

      await this.copyPublicLink(campaign);
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        this.snackbar.error('Could not share the campaign link.');
      }
    }
  }

  publish(campaign: Campaign): void {
    const id = this.idOf(campaign);
    if (!id || this.actionId) return;

    this.actionId = id;
    this.refreshView();

    this.api
      .publishCampaign(id)
      .pipe(
        finalize(() => {
          this.actionId = '';
          this.refreshView();
        })
      )
      .subscribe({
        next: (updated) => {
          this.replaceCampaign(updated);
          this.snackbar.success('Campaign published successfully.');
          this.refreshView();
        },
        error: (error) => {
          this.snackbar.fromApiError(error, 'Could not publish campaign.');
        }
      });
  }

  unpublish(campaign: Campaign): void {
    const id = this.idOf(campaign);
    if (!id || this.actionId) return;

    this.actionId = id;
    this.refreshView();

    this.api
      .unpublishCampaign(id)
      .pipe(
        finalize(() => {
          this.actionId = '';
          this.refreshView();
        })
      )
      .subscribe({
        next: (updated) => {
          this.replaceCampaign(updated);
          this.snackbar.success('Campaign unpublished successfully.');
          this.refreshView();
        },
        error: (error) => {
          this.snackbar.fromApiError(error, 'Could not unpublish campaign.');
        }
      });
  }

  reuse(campaign: Campaign): void {
    const id = this.idOf(campaign);
    if (!id || this.actionId) return;

    this.actionId = id;
    this.refreshView();

    this.api
      .reuseCampaign(id)
      .pipe(
        finalize(() => {
          this.actionId = '';
          this.refreshView();
        })
      )
      .subscribe({
        next: (updated) => {
          this.replaceCampaign(updated);
          this.snackbar.success('Campaign reused. A new draft cycle has been created.');
          this.refreshView();
        },
        error: (error) => {
          this.snackbar.fromApiError(error, 'Could not reuse campaign.');
        }
      });
  }

  remove(campaign: Campaign): void {
    const id = this.idOf(campaign);
    if (!id || this.actionId) return;

    if (!window.confirm(`Delete "${campaign.name}"?`)) {
      return;
    }

    this.actionId = id;
    this.refreshView();

    this.api
      .deleteCampaign(id)
      .pipe(
        finalize(() => {
          this.actionId = '';
          this.refreshView();
        })
      )
      .subscribe({
        next: () => {
          this.campaigns = this.campaigns.filter((item) => this.idOf(item) !== id);
          if (this.editingId === id) {
            this.cancelEdit();
          }
          this.snackbar.success('Campaign deleted successfully.');
          this.refreshView();
        },
        error: (error) => {
          this.snackbar.fromApiError(error, 'Could not delete campaign.');
        }
      });
  }

  statusLabel(status: CampaignStatus): string {
    const labels: Record<CampaignStatus, string> = {
      draft: 'Draft',
      scheduled: 'Scheduled',
      published: 'Published',
      expired: 'Expired',
      unpublished: 'Unpublished'
    };

    return labels[status] || 'Draft';
  }

  isActive(campaign: Campaign): boolean {
    return campaign.status === 'published';
  }

  activeLabel(campaign: Campaign): string {
    return this.isActive(campaign) ? 'Active' : 'Inactive';
  }

  pagePath(campaign: Campaign): string {
    if (campaign.publicSlug) {
      return campaign.publicSlug;
    }

    const business = campaign.businessSlug || this.businessSlug;
    const slug = campaign.pageSlug || '';

    if (!business) {
      return '';
    }

    return slug === 'blank' || !slug
      ? business
      : `${business}/${slug}`;
  }

  templateLabel(campaign: Campaign): string {
    if (campaign.templateName) {
      return campaign.templateName;
    }

    return campaign.templateId === this.blankTemplateId
      ? '<blank>'
      : '—';
  }

  canPublish(campaign: Campaign): boolean {
    return campaign.status === 'draft' || campaign.status === 'unpublished';
  }

  canOpen(campaign: Campaign): boolean {
    return campaign.status === 'published';
  }

  canUnpublish(campaign: Campaign): boolean {
    return campaign.status === 'published' || campaign.status === 'scheduled';
  }

  publicUrl(campaign: Campaign): string {
    if (campaign.fullSlug) {
      return campaign.fullSlug;
    }

    const business = campaign.businessSlug || this.businessSlug;
    const slug = campaign.pageSlug || '';

    if (!business || !slug) {
      return '';
    }

    return slug === 'blank'
      ? `${this.publicDomain}/${business}`
      : `${this.publicDomain}/${business}/${slug}`;
  }

  validDays(campaign: Campaign): number {
    const started = new Date(campaign.cycleStartedAt || campaign.createdAt || Date.now());
    const end = new Date(campaign.endAt || started);

    if (Number.isNaN(started.getTime()) || Number.isNaN(end.getTime())) {
      return 0;
    }

    return Math.max(
      0,
      Math.ceil((end.getTime() - started.getTime()) / (1000 * 60 * 60 * 24))
    );
  }

  expiresInLabel(campaign: Campaign): string {
    if (!campaign.endAt) return 'No expiry';

    const endDate = new Date(campaign.endAt);
    if (Number.isNaN(endDate.getTime())) return '—';

    const days = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Expired';
    if (days === 1) return '1 day';
    if (days < 30) return `${days} days`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months === 1 ? '' : 's'}`;

    const years = Math.floor(days / 365);
    const remainderMonths = Math.floor((days % 365) / 30);

    return remainderMonths > 0
      ? `${years}y ${remainderMonths}m`
      : `${years} year${years === 1 ? '' : 's'}`;
  }

  categoryLabel(category: CampaignCategory): string {
    return this.categoryOptions.find((item) => item.value === category)?.label || 'Campaign';
  }

  actionBusy(campaign: Campaign): boolean {
    return this.actionId === this.idOf(campaign);
  }

  trackByCampaign(_: number, campaign: Campaign): string {
    return this.idOf(campaign);
  }

  private replaceCampaign(campaign: Campaign): void {
    const id = this.idOf(campaign);
    this.campaigns = this.campaigns.map((item) =>
      this.idOf(item) === id ? campaign : item
    );
  }

  private idOf(campaign: Campaign): string {
    return String(campaign.id || campaign._id || '').trim();
  }

  private cleanName(value: string): string {
    return String(value || '').trim();
  }

  private cleanSlug(value: string): string {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private titleFromSlug(slug: string): string {
    if (slug === 'blank') {
      return 'Main Business Page';
    }

    return String(slug || '')
      .split('-')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'Untitled Page';
  }

  private toIso(value: string): string | null {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  private toInputDate(value?: string | null): string {
    if (!value) return '';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private copyWithFallback(value: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  private resetForm(): void {
    this.name = '';
    this.pageSlug = '';
    this.category = 'other';
    this.templateId = '';
    this.description = '';
    this.publishMode = 'draft';
    this.scheduleAt = '';
    this.endAt = '';
  }

  private refreshView(): void {
    try {
      this.cdr.detectChanges();
    } catch {
      // Component may already be destroyed during navigation.
    }
  }
}
