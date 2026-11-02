import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { API_BASE_URL } from '../../core/api.config';

export interface InvoiceSettings {
  template: 'classic' | 'corporate' | 'minimal' | 'modern' | 'gst' | 'premium';
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

const KEY = 'brain_techno_invoice_settings_v1';

const DEFAULTS: InvoiceSettings = {
  template: 'classic',
  pageSize: 'a4',
  printColor: 'color',
  primaryColor: '#ff4d6d',
  businessName: '',
  logoDataUrl: '',
  address: '',
  phone: '',
  email: '',
  gstin: '',
  footer: '',
  invoicePrefix: 'BTECH',
  invoiceStartNumber: 1,
  invoiceNumberPadding: 5,
};


@Injectable({ providedIn: 'root' })
export class InvoiceSettingsService {
  private readonly endpoint = `${API_BASE_URL}/business-hub/invoice-settings`;

  constructor(private readonly http: HttpClient) { }

  get(): InvoiceSettings {
    try {
      if (typeof localStorage === 'undefined') return { ...DEFAULTS };
      const saved = JSON.parse(localStorage.getItem(KEY) || '{}') as Partial<InvoiceSettings>;
      return this.normalize({ ...DEFAULTS, ...saved });
    } catch {
      return { ...DEFAULTS };
    }
  }

  load(): Observable<InvoiceSettings> {
    return this.http
      .get<Partial<InvoiceSettings> | { settings?: Partial<InvoiceSettings> }>(this.endpoint)
      .pipe(
        map(response => this.extractSettings(response)),
        tap(settings => this.writeCache(settings)),
      );
  }

  save(value: InvoiceSettings): Observable<InvoiceSettings> {
    const settings = this.normalize(value);

    return this.http
      .patch<Partial<InvoiceSettings> | { settings?: Partial<InvoiceSettings> }>(
        this.endpoint,
        settings,
      )
      .pipe(
        map(response => this.extractSettings(response)),
        tap(savedSettings => this.writeCache(savedSettings)),
      );
  }

  create(value: InvoiceSettings): Observable<InvoiceSettings> {
    const settings = this.normalize(value);

    return this.http.post<
      Partial<InvoiceSettings> | { settings?: Partial<InvoiceSettings> }
    >(this.endpoint, settings).pipe(
      map(response => this.extractSettings(response)),
    );
  }

  private extractSettings(
    response: Partial<InvoiceSettings> | { settings?: Partial<InvoiceSettings> },
  ): InvoiceSettings {
    const wrapped = response && 'settings' in response && response.settings
      ? response.settings
      : response as Partial<InvoiceSettings>;
    return this.normalize({ ...this.get(), ...wrapped });
  }

  private normalize(value: Partial<InvoiceSettings>): InvoiceSettings {
    const prefix = String(value.invoicePrefix || DEFAULTS.invoicePrefix)
      .trim()
      .replace(/[^a-zA-Z0-9-]/g, '')
      .slice(0, 20) || DEFAULTS.invoicePrefix;

    return {
      ...DEFAULTS,
      ...value,
      invoicePrefix: prefix,
      invoiceStartNumber: Math.max(1, Math.floor(Number(value.invoiceStartNumber) || 1)),
      invoiceNumberPadding: Math.min(12, Math.max(1, Math.floor(Number(value.invoiceNumberPadding) || 5))),
    };
  }

  private writeCache(settings: InvoiceSettings): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Could not cache invoice settings:', error);
    }
  }
}
