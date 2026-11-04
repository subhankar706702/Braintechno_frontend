import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { catchError, filter, finalize, startWith, switchMap, take, takeUntil } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';

import {
  InvoiceSettings,
  InvoiceSettingsService,
  InvoiceTemplate,
} from './models/invoice-settings.service';
import { BusinessProfileService } from '../dashboard/business-profile/business-profile.service';


type HubSection =
  | 'my-business'
  | 'invoice'
  | 'stock'
  | 'payment-reminder'
  | 'growth-checklist'
  | 'settings';

type HubInvoiceSettings = InvoiceSettings & {
  invoicePrefix: string;
  invoiceStartNumber: number;
  invoiceNumberPadding: number;
};
type InvoicePlan = 'free' | 'basic' | 'premium' | 'custom';

interface InvoiceTemplateOption {
  id: InvoiceTemplate;
  name: string;
  description: string;
  plan: InvoicePlan;
  accent: string;
  style: string;
}
interface HubCard {
  label: string;
  value: string;
  note: string;
  icon: string;
  tone: string;
}

@Component({
  selector: 'bt-business-hub-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './business-hub.page.html',
  styleUrl: './business-hub.page.scss',
})
export class BusinessHubPage implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private settingsLoadStarted = false;
  profileLoaded = false;
  settingsLoading = false;
  settingsSaving = false;
  previewOpen = false;
  profileError = '';
  lockedProfile = {
    businessName: '', logoDataUrl: '', phone: '', email: '', primaryColor: '#ff4d6d',
  };

  section: HubSection = 'my-business';

  title = 'My Business';
  description =
    'Your business at a glance. Track activity and find your next growth opportunity.';

  readonly overviewCards: HubCard[] = [
    {
      label: "Today's Sales",
      value: '—',
      note: 'Sales recorded today',
      icon: 'trending_up',
      tone: 'blue',
    },
    {
      label: "Today's Expenses",
      value: '—',
      note: 'Expenses recorded today',
      icon: 'account_balance_wallet',
      tone: 'orange',
    },
    {
      label: 'Outstanding Due',
      value: '—',
      note: 'From Payment Reminder',
      icon: 'payments',
      tone: 'violet',
    },
    {
      label: 'Low Stock Items',
      value: '—',
      note: 'From My Stock',
      icon: 'inventory_2',
      tone: 'green',
    },
  ];

  readonly quickLinks = [
    {
      title: 'Record sales or expense',
      description: 'Keep daily business entries organised.',
      icon: 'add_chart',
      route: '/app/business-hub/my-business/sales-expenses',
    },
    {
      title: 'Create an invoice',
      description: 'Prepare an invoice for a customer.',
      icon: 'receipt_long',
      route: '/app/business-hub/invoice',
    },
    {
      title: 'Update stock',
      description: 'Add products or update quantities.',
      icon: 'inventory_2',
      route: '/app/business-hub/stock',
    },
    {
      title: 'Check customer dues',
      description: 'Review outstanding and paid records.',
      icon: 'event_available',
      route: '/app/business-hub/payment-reminder',
    },
  ];

  readonly checklistItems = [
    'Complete your Business Profile',
    'Add products or services to your catalogue',
    'Create your first invoice',
    'Share your business online',
  ];

  invoiceSettings: HubInvoiceSettings;

  settingsExists = false;
  settingsSaved = false;
  settingsError = '';

  constructor(
    private readonly router: Router,
    private readonly invoiceSettingsService: InvoiceSettingsService,
    private readonly businessProfileService: BusinessProfileService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.invoiceSettings = {
      businessName: '', logoDataUrl: '', phone: '', email: '',
      primaryColor: '#ff4d6d', address: '', gstin: '', footer: '',
      invoicePrefix: 'BTECH', invoiceStartNumber: 1,
      invoiceNumberPadding: 5, pageSize: 'a4', printColor: 'color',
      template: 'classic',
    } as HubInvoiceSettings;
  }
  // Replace this default with the user's actual subscription plan.
  currentInvoicePlan: InvoicePlan = 'free';

  readonly invoicePlanOrder: Record<InvoicePlan, number> = {
    free: 1,
    basic: 2,
    premium: 3,
    custom: 4,
  };

  readonly invoiceTemplateGroups: {
    plan: InvoicePlan;
    title: string;
    description: string;
    templates: InvoiceTemplateOption[];
  }[] = [
      {
        plan: 'free',
        title: 'Free Designs',
        description: 'Simple and professional invoice layouts.',
        templates: [
          {
            id: 'classic',
            name: 'Classic',
            description: 'Traditional business invoice',
            plan: 'free',
            accent: '#334155',
            style: 'classic',
          },
          {
            id: 'minimal',
            name: 'Minimal',
            description: 'Clean and simple layout',
            plan: 'free',
            accent: '#64748b',
            style: 'minimal',
          },
          {
            id: 'basic-blue',
            name: 'Basic Blue',
            description: 'Professional blue header',
            plan: 'free',
            accent: '#2563eb',
            style: 'blue',
          },
          {
            id: 'mono',
            name: 'Mono',
            description: 'Black and white invoice',
            plan: 'free',
            accent: '#111827',
            style: 'mono',
          },
        ],
      },
      {
        plan: 'basic',
        title: 'Basic Designs',
        description: 'More layouts for growing businesses.',
        templates: [
          {
            id: 'corporate',
            name: 'Corporate',
            description: 'Strong corporate header',
            plan: 'basic',
            accent: '#1e40af',
            style: 'corporate',
          },
          {
            id: 'elegant',
            name: 'Elegant',
            description: 'Elegant typography and spacing',
            plan: 'basic',
            accent: '#0f766e',
            style: 'elegant',
          },
          {
            id: 'creative',
            name: 'Creative',
            description: 'Creative color layout',
            plan: 'basic',
            accent: '#ea580c',
            style: 'creative',
          },
          {
            id: 'sidebar',
            name: 'Sidebar',
            description: 'Colored business information panel',
            plan: 'basic',
            accent: '#7c3aed',
            style: 'sidebar',
          },
        ],
      },
      {
        plan: 'premium',
        title: 'Premium Designs',
        description: 'Advanced and premium invoice styles.',
        templates: [
          {
            id: 'luxury',
            name: 'Luxury',
            description: 'Premium black and gold design',
            plan: 'premium',
            accent: '#b08d42',
            style: 'luxury',
          },
          {
            id: 'gradient',
            name: 'Gradient',
            description: 'Modern gradient header',
            plan: 'premium',
            accent: '#7c3aed',
            style: 'gradient',
          },
          {
            id: 'executive',
            name: 'Executive',
            description: 'Executive business appearance',
            plan: 'premium',
            accent: '#172554',
            style: 'executive',
          },
          {
            id: 'signature',
            name: 'Signature',
            description: 'Large typography and branding',
            plan: 'premium',
            accent: '#9f1239',
            style: 'signature',
          },
          {
            id: 'modern-pro',
            name: 'Modern Pro',
            description: 'Structured modern layout',
            plan: 'premium',
            accent: '#0891b2',
            style: 'modern-pro',
          },
        ],
      },
      {
        plan: 'custom',
        title: 'Custom Designs',
        description: 'Advanced branding and layout customization.',
        templates: [
          {
            id: 'my-brand',
            name: 'My Brand',
            description: 'Personalized business branding',
            plan: 'custom',
            accent: '#2563eb',
            style: 'my-brand',
          },
          {
            id: 'design-studio',
            name: 'Design Studio',
            description: 'Flexible layout and typography',
            plan: 'custom',
            accent: '#9333ea',
            style: 'design-studio',
          },
        ],
      },
    ];

  // getInvoiceTemplateLocked(template: InvoiceTemplateOption): boolean {
  //   return this.invoicePlanOrder[this.currentInvoicePlan] <
  //     this.invoicePlanOrder[template.plan];
  // }

  getInvoiceTemplateLocked(template: InvoiceTemplateOption): boolean {
  return false;
}

  selectInvoiceTemplate(template: InvoiceTemplateOption): void {
    if (this.getInvoiceTemplateLocked(template)) {
      return;
    }

    this.invoiceSettings.template = template.id as InvoiceTemplate;
    this.onInvoiceTemplateChange();
  }

  getInvoicePlanLabel(plan: InvoicePlan): string {
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  }
  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd,
        ),
        startWith(null),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.syncSection();

        if (this.section === 'settings') {
          if (!this.settingsLoadStarted) this.loadInvoiceSettings();
        } else {
          // Returning to Settings always fetches current /profile again.
          this.settingsLoadStarted = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private errorText(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return error instanceof Error ? error.message : fallback;
    }
    const body = error.error;
    const message = typeof body === 'string'
      ? body : body?.message || body?.error?.message || body?.error;
    return typeof message === 'string' ? message : fallback;
  }

  private loadInvoiceSettings(): void {
    if (this.settingsLoading) return;
    this.settingsLoadStarted = true;
    this.settingsLoading = true;
    this.cdr.markForCheck();
    this.profileLoaded = false;
    this.profileError = '';
    this.settingsError = '';

    // Always read /profile before /invoice-settings. They own different fields.
    this.businessProfileService.getProfile().pipe(
      switchMap(response => {
        // Accept the raw profile response and the common API/service wrappers.
        const raw = response as unknown as Record<string, any>;
        const body = raw?.['data']?.['account'] ? raw['data']
          : raw?.['result']?.['account'] ? raw['result']
            : raw?.['body']?.['account'] ? raw['body']
              : raw?.['profileData']?.['account'] ? raw['profileData']
                : raw;
        const account = body?.['account'] ?? body?.['data']?.['account'] ?? body?.['profile']?.['account'];
        const profile = body?.['profile'] ?? body?.['data']?.['profile'] ?? {};
        if (!account) {
          throw new Error('GET /profile did not return account details.');
        }

        const logo = profile.businessLogo ?? profile.logo ?? account.businessLogo ?? '';
        this.lockedProfile = {
          businessName: account.businessName ?? '',
          logoDataUrl: typeof logo === 'string' ? logo : '',
          phone: profile.businessMobileNumber || account.ownerMobileNumber || account.phone || '',
          email: account.email || account.businessEmail || '',
          primaryColor: profile.brandColors?.primary || '#ff4d6d',
        };
        this.profileLoaded = true;
        this.cdr.markForCheck();

        return this.invoiceSettingsService.load().pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 404) return of(null);
            throw error;
          }),
        );
      }),
      takeUntil(this.destroy$),
      finalize(() => { this.settingsLoading = false; this.cdr.markForCheck(); }),
    ).subscribe({
      next: settings => {
        const responseBody = settings as unknown as Record<string, any> | null;
        const saved = (responseBody?.['settings'] ?? responseBody?.['data']?.['settings']
          ?? responseBody?.['data'] ?? responseBody) as Partial<HubInvoiceSettings> | null;
        this.settingsExists = !!saved;
        if (saved) {
          // Whitelist prevents invoice-settings from overriding profile values.
          const editable: Partial<HubInvoiceSettings> = {};
          const fields: (keyof HubInvoiceSettings)[] = [
            'address', 'gstin', 'footer', 'invoicePrefix',
            'invoiceStartNumber', 'invoiceNumberPadding',
            'pageSize', 'printColor', 'template',
          ];
          for (const key of fields) {
            if (saved[key] !== undefined && saved[key] !== null) {
              // Assigning a dynamically-selected field requires a narrowed indexed type.
              (editable as Record<string, unknown>)[key] = saved[key];
            }
          }
          this.invoiceSettings = { ...this.invoiceSettings, ...editable };
        }
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        const message = this.errorText(error, 'Could not load Business Hub settings.');
        this.settingsError = message;
        if (!this.profileLoaded) this.profileError = message;
        this.settingsLoadStarted = false;
        this.settingsLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onInvoiceTemplateChange(): void {
    this.settingsSaved = false;
  }

  get sampleInvoiceNumber(): string {
    const prefix = this.invoiceSettings.invoicePrefix || 'BTECH';
    const num = Math.max(1, Number(this.invoiceSettings.invoiceStartNumber) || 1);
    const padding = Math.min(12, Math.max(1, Number(this.invoiceSettings.invoiceNumberPadding) || 5));
    return `${prefix}${String(num).padStart(padding, '0')}`;
  }

  viewSelectedInvoice(): void {
    if (this.settingsLoading || !this.profileLoaded) {
      return;
    }

    this.previewOpen = true;
    this.cdr.markForCheck();
  }

  openInvoicePreview(): void {
    this.viewSelectedInvoice();
  }

  closeInvoicePreview(): void {
    this.previewOpen = false;
    this.cdr.markForCheck();
  }

  saveInvoiceSettings(): void {
    if (this.settingsSaving || this.settingsLoading || !this.profileLoaded) return;
    this.settingsError = '';
    this.settingsSaved = false;
    const prefix = String(this.invoiceSettings.invoicePrefix || '').trim();
    if (!prefix) {
      this.settingsError = 'Invoice prefix is required.';
      return;
    }
    const startNumber = Number(this.invoiceSettings.invoiceStartNumber);
    const padding = Number(this.invoiceSettings.invoiceNumberPadding);
    if (!Number.isSafeInteger(startNumber) || startNumber < 1) {
      this.settingsError = 'Invoice start number must be a positive whole number.';
      return;
    }
    if (!Number.isSafeInteger(padding) || padding < 1 || padding > 12) {
      this.settingsError = 'Invoice number padding must be between 1 and 12.';
      return;
    }
    // /profile owns the five locked fields. The invoice-settings API also
    // accepts these fields, so populate them from the current profile snapshot
    // instead of the empty invoiceSettings defaults. They remain read-only in UI.
    const payload = {
      businessName: this.lockedProfile.businessName,
      logoDataUrl: this.lockedProfile.logoDataUrl,
      phone: this.lockedProfile.phone,
      email: this.lockedProfile.email,
      primaryColor: this.lockedProfile.primaryColor,
      address: this.invoiceSettings.address,
      gstin: this.invoiceSettings.gstin,
      footer: this.invoiceSettings.footer,
      invoicePrefix: prefix,
      invoiceStartNumber: startNumber,
      invoiceNumberPadding: padding,
      pageSize: this.invoiceSettings.pageSize,
      printColor: this.invoiceSettings.printColor,
      template: this.invoiceSettings.template,
    };
    this.invoiceSettings.invoiceStartNumber = startNumber;
    this.invoiceSettings.invoiceNumberPadding = padding;
    this.settingsSaving = true;
    this.cdr.markForCheck();
    const request = this.settingsExists
      ? this.invoiceSettingsService.save(payload as unknown as InvoiceSettings)
      : this.invoiceSettingsService.create(payload as unknown as InvoiceSettings);
    request.pipe(
      take(1),
      takeUntil(this.destroy$),
      finalize(() => { this.settingsSaving = false; this.cdr.markForCheck(); }),
    ).subscribe({
      next: saved => {
        // HTTP succeeded: stop spinner immediately, even with nonstandard service streams.
        this.settingsSaving = false;
        const raw = saved as unknown as Record<string, any> | null;
        if (raw?.['success'] === false) {
          this.settingsError = String(raw['message'] || 'Could not save invoice settings.');
          this.cdr.markForCheck();
          return;
        }
        // POST/PATCH responses contain { success, message, settings }.
        const result = (raw?.['settings'] ?? raw?.['data']?.['settings']
          ?? raw?.['data'] ?? raw) as Partial<HubInvoiceSettings> | null;
        // Apply only saved editable fields; keep current /profile values.
        if (result) {
          const editable: Record<string, unknown> = {};
          for (const key of [
            'address', 'gstin', 'footer', 'invoicePrefix',
            'invoiceStartNumber', 'invoiceNumberPadding',
            'pageSize', 'printColor', 'template',
          ]) {
            if ((result as Record<string, unknown>)[key] !== undefined) {
              editable[key] = (result as Record<string, unknown>)[key];
            }
          }
          this.invoiceSettings = { ...this.invoiceSettings, ...editable };
        }
        this.settingsExists = true;
        this.settingsSaved = true;
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.settingsSaving = false;
        this.settingsError = this.errorText(error, 'Could not save invoice settings.');
        this.cdr.markForCheck();
      },
    });
  }

  syncSection(): void {
    const url = this.router.url.split('?')[0].replace(/\/$/, '');

    const routes: Record<string, HubSection> = {
      '/app/business-hub': 'my-business',
      '/app/business-hub/my-business': 'my-business',
      '/app/business-hub/my-business/sales-expenses': 'my-business',
      '/app/business-hub/invoice': 'invoice',
      '/app/business-hub/stock': 'stock',
      '/app/business-hub/payment-reminder': 'payment-reminder',
      '/app/business-hub/growth-checklist': 'growth-checklist',
      '/app/business-hub/settings': 'settings',
    };

    this.section = routes[url] || 'my-business';

    const content: Record<
      HubSection,
      { title: string; description: string }
    > = {
      'my-business': {
        title: url.endsWith('/sales-expenses')
          ? 'Daily Sales & Expense Tracker'
          : 'My Business',
        description: url.endsWith('/sales-expenses')
          ? 'A simple place to record and review your daily business activity.'
          : 'Your business at a glance. Track activity and find your next growth opportunity.',
      },
      invoice: {
        title: 'Invoice Generator',
        description: 'Create clear, professional invoices for your customers.',
      },
      stock: {
        title: 'My Stock',
        description: 'Manage products, prices, quantities and stock status.',
      },
      'payment-reminder': {
        title: 'Payment Reminder',
        description:
          'Keep track of outstanding dues, installments and completed payments.',
      },
      'growth-checklist': {
        title: 'Business Growth Checklist',
        description:
          'Small steps to strengthen your business and online presence.',
      },
      settings: {
        title: 'Hub Settings',
        description:
          'Manage your invoice design and print preferences.',
      },
    };

    this.title = content[this.section].title;
    this.description = content[this.section].description;
  }

  open(route: string): void {
    void this.router.navigateByUrl(route);
  }

  isSalesExpensesView(): boolean {
    return this.router.url
      .split('?')[0]
      .replace(/\/$/, '')
      .endsWith('/sales-expenses');
  }
}