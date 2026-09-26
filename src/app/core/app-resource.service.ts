import {
  Injectable,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppResourceService {

  readonly brand = {
    name: 'BRAIN TECHNO',
    shortName: 'BT',
    poweredBy: 'Powered by BRAIN TECHNO',
  } as const;

  readonly images = {
    logo:
      'https://pub-17cca15e23224082ba93eaef907a4ea5.r2.dev/uploads/1790408786106-16231429.png',

    logoMark:
      'https://pub-17cca15e23224082ba93eaef907a4ea5.r2.dev/uploads/1790408786106-16231429.png',

    businessPlaceholder:
      'https://pub-17cca15e23224082ba93eaef907a4ea5.r2.dev/uploads/1790408786106-16231429.png',
  } as const;

  readonly links = {
    website:
      'https://braintechno.in',

    home:
      'https://braintechno.in',

    contact:
      'https://braintechno.in/contact',

    about:
      'https://braintechno.in/about',

    privacy:
      'https://braintechno.in/privacy-policy',

    terms:
      'https://braintechno.in/terms-of-service',
  } as const;

  get currentYear(): number {
    return new Date().getFullYear();
  }

  get copyrightText(): string {
    return `© ${this.currentYear} ${this.brand.name}. All rights reserved.`;
  }
}
