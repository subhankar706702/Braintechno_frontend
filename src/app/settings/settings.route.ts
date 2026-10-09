import { Routes } from '@angular/router';

export const SETTING_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'appearance',
  },
  {
    path: 'appearance',
    loadComponent: () =>
      import('./appearance/appearance.page').then(
        (m) => m.AppearancePage,
      ),
  },
  {
    path: 'language',
    loadComponent: () =>
      import('./language/language-region.page').then(
        (m) => m.LanguageRegionPage,
      ),
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./notifications/notifications.page').then(
        (m) => m.NotificationsPage,
      ),
  },
  {
    path: 'editor',
    loadComponent: () =>
      import('./editor/editor-preferences.page').then(
        (m) => m.EditorPreferencesPage,
      ),
  },
  {
    path: 'accessibility',
    loadComponent: () =>
      import('./accessibility/accessibility.page').then(
        (m) => m.AccessibilityPage,
      ),
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./privacy/privacy-data.page').then(
        (m) => m.PrivacyDataPage,
      ),
  },
  {
    path: 'security',
    loadComponent: () =>
      import('./security/security.page').then(
        (m) => m.SecurityPage,
      ),
  },
  {
    path: 'system',
    loadComponent: () =>
      import('./system/system.page').then(
        (m) => m.SystemPage,
      ),
  },
  {
    path: 'pricing',
    loadComponent: () =>
      import('../pricing/pricing.page').then(
        (m) => m.PricingPage,
      ),
  },
  {
    path: 'payment-history',
    loadComponent: () =>
      import('../payment/payment-history.page').then(
        (m) => m.PaymentHistoryPage,
      ),
  },
];