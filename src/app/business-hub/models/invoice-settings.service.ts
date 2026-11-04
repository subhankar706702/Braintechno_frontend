
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { API_BASE_URL } from '../../core/api.config';

export type InvoiceTemplate =
  | 'classic'
  | 'minimal'
  | 'basic-blue'
  | 'mono'
  | 'corporate'
  | 'elegant'
  | 'creative'
  | 'sidebar'
  | 'luxury'
  | 'gradient'
  | 'executive'
  | 'signature'
  | 'modern-pro'
  | 'my-brand'
  | 'design-studio'
  | 'modern'
  | 'gst'
  | 'premium';

export interface InvoiceSettings {
  template: InvoiceTemplate;
  pageSize: 'a4' | 'a5' | 'letter' | 'legal';
  printColor: 'color' | 'bw';
  primaryColor: string;
  businessName: string;
  logoDataUrl: string;
  gstin: string;
  address: string;
  phone: string;
  email: string;
  footer: string;
  invoicePrefix: string;
  invoiceStartNumber: number;
  invoiceNumberPadding: number;
}

type InvoiceSettingsResponse =
  | Partial<InvoiceSettings>
  | {
      success?: boolean;
      message?: string;
      settings?: Partial<InvoiceSettings>;
    };

const KEY = 'brain_techno_invoice_settings_v1';

const VALID_TEMPLATES: InvoiceTemplate[] = [
  'classic',
  'minimal',
  'basic-blue',
  'mono',
  'corporate',
  'elegant',
  'creative',
  'sidebar',
  'luxury',
  'gradient',
  'executive',
  'signature',
  'modern-pro',
  'my-brand',
  'design-studio',
  'modern',
  'gst',
  'premium',
];

const DEFAULTS: InvoiceSettings = {
  template: 'classic',
  pageSize: 'a4',
  printColor: 'color',
  primaryColor: '#ff4d6d',
  businessName: '',
  logoDataUrl: '',
  gstin: '',
  address: '',
  phone: '',
  email: '',
  footer: '',
  invoicePrefix: 'BTECH',
  invoiceStartNumber: 1,
  invoiceNumberPadding: 5,
};

@Injectable({
  providedIn: 'root',
})
export class InvoiceSettingsService {
  private readonly endpoint =
    `${API_BASE_URL}/business-hub/invoice-settings`;

  constructor(private readonly http: HttpClient) {}

  get(): InvoiceSettings {
    try {
      if (typeof localStorage === 'undefined') {
        return { ...DEFAULTS };
      }

      const saved = JSON.parse(
        localStorage.getItem(KEY) || '{}'
      ) as Partial<InvoiceSettings>;

      return this.normalize({
        ...DEFAULTS,
        ...saved,
      });
    } catch (error) {
      console.error('Could not read invoice settings:', error);
      return { ...DEFAULTS };
    }
  }

  load(): Observable<InvoiceSettings> {
    return this.http
      .get<InvoiceSettingsResponse>(this.endpoint)
      .pipe(
        map(response => this.extractSettings(response)),
        tap(settings => this.writeCache(settings)),
      );
  }

  create(value: InvoiceSettings): Observable<InvoiceSettings> {
    return this.save(value);
  }

  save(value: InvoiceSettings): Observable<InvoiceSettings> {
    const settings = this.normalize(value);

    return this.http
      .patch<InvoiceSettingsResponse>(
        this.endpoint,
        settings,
      )
      .pipe(
        map(response => this.extractSettings(response)),
        tap(savedSettings => this.writeCache(savedSettings)),
      );
  }

  private extractSettings(
    response: InvoiceSettingsResponse,
  ): InvoiceSettings {
    let settings: Partial<InvoiceSettings>;

    if (
      response &&
      typeof response === 'object' &&
      'settings' in response &&
      response.settings
    ) {
      settings = response.settings;
    } else {
      settings = response as Partial<InvoiceSettings>;
    }

    return this.normalize({
      ...this.get(),
      ...settings,
    });
  }

  private normalize(
    value: Partial<InvoiceSettings>,
  ): InvoiceSettings {
    const template = VALID_TEMPLATES.includes(
      value.template as InvoiceTemplate
    )
      ? value.template as InvoiceTemplate
      : DEFAULTS.template;

    const pageSize =
      value.pageSize === 'a5' ||
      value.pageSize === 'letter' ||
      value.pageSize === 'legal'
        ? value.pageSize
        : 'a4';

    const printColor =
      value.printColor === 'bw' ? 'bw' : 'color';

    const prefix = String(
      value.invoicePrefix || DEFAULTS.invoicePrefix
    )
      .trim()
      .replace(/[^a-zA-Z0-9-]/g, '')
      .slice(0, 20) || DEFAULTS.invoicePrefix;

    const startNumber = Number(value.invoiceStartNumber);
    const padding = Number(value.invoiceNumberPadding);

    return {
      ...DEFAULTS,
      ...value,

      template,
      pageSize,
      printColor,

      primaryColor:
        typeof value.primaryColor === 'string' &&
        /^#[0-9a-fA-F]{6}$/.test(value.primaryColor.trim())
          ? value.primaryColor.trim()
          : DEFAULTS.primaryColor,

      businessName: String(value.businessName || ''),
      logoDataUrl: String(value.logoDataUrl || ''),
      gstin: String(value.gstin || ''),
      address: String(value.address || ''),
      phone: String(value.phone || ''),
      email: String(value.email || ''),
      footer: String(value.footer || ''),

      invoicePrefix: prefix,

      invoiceStartNumber:
        Number.isSafeInteger(startNumber) && startNumber >= 1
          ? startNumber
          : DEFAULTS.invoiceStartNumber,

      invoiceNumberPadding:
        Number.isFinite(padding) && padding >= 1
          ? Math.min(12, Math.floor(padding))
          : DEFAULTS.invoiceNumberPadding,
    };
  }

  private writeCache(settings: InvoiceSettings): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(
        KEY,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error(
        'Could not cache invoice settings:',
        error
      );
    }
  }
}
