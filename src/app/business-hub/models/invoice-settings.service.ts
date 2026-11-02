
import { Injectable } from '@angular/core';

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
  state: string;
  footer: string;
}

const KEY = 'brain_techno_invoice_settings_v1';

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
  state: '',
  footer: ''
};

@Injectable({
  providedIn: 'root'
})
export class InvoiceSettingsService {

  get(): InvoiceSettings {
    try {
      if (typeof localStorage === 'undefined') {
        return { ...DEFAULTS };
      }

      const saved = JSON.parse(
        localStorage.getItem(KEY) || '{}'
      );

      return {
        ...DEFAULTS,
        ...saved
      };
    } catch {
      return { ...DEFAULTS };
    }
  }

  save(value: InvoiceSettings): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const settings: InvoiceSettings = {
      ...DEFAULTS,
      ...value
    };

    localStorage.setItem(
      KEY,
      JSON.stringify(settings)
    );
  }

  defaults(): InvoiceSettings {
    return { ...DEFAULTS };
  }
}
