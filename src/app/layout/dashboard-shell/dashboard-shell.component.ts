import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { MatIconModule } from '@angular/material/icon';

import { ConfirmDialogService } from '../../Common/components/confirm-dialog/confirm-dialog.service';
import { BusinessProfileService } from '../../dashboard/business-profile/business-profile.service';
import { AppResourceService } from '../../core/app-resource.service';
import { AuthService } from '../../core/auth.service';

export type MenuCategory =
  | 'default'
  | 'pro'
  | 'custom'
  | 'admin'
  | 'coming-soon'
  | 'disabled'
  | 'hidden';

type ShellNavItem = {
  label: string;
  icon: string;
  route: string;
  category?: MenuCategory | null;
};

type ShellSubNavItem = {
  label: string;
  icon: string;
  route: string;
  category?: MenuCategory | null;
};

@Component({
  selector: 'bt-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatIconModule],
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss',
})
export class DashboardShellComponent implements OnInit, OnDestroy {
  mobileMenuOpen = false;
  settingsMenuOpen = false;
  businessHubMenuOpen = false;

  private readonly destroy$ = new Subject<void>();

  readonly settingsSubItems: ShellSubNavItem[] = [
    { label: 'Appearance', icon: 'light_mode', route: '/app/settings/appearance', category: 'default' },
    { label: 'Language & Region', icon: 'language', route: '/app/settings/language', category: 'default' },
    { label: 'Notifications', icon: 'notifications_none', route: '/app/settings/notifications', category: 'default' },
    { label: 'Editor Preferences', icon: 'edit_square', route: '/app/settings/editor', category: 'default' },
    { label: 'Accessibility', icon: 'accessibility_new', route: '/app/settings/accessibility', category: 'default' },
    { label: 'Privacy & Data', icon: 'shield', route: '/app/settings/privacy', category: 'default' },
    { label: 'Security', icon: 'lock', route: '/app/settings/security', category: 'default' },
    { label: 'System', icon: 'info', route: '/app/settings/system', category: 'default' },
    { label: 'Subscription & Plans', icon: 'workspace_premium', route: '/app/settings/pricing', category: 'default' },
    { label: 'Payment History', icon: 'receipt_long', route: '/app/settings/payment-history', category: 'default' },
  ];

  readonly businessHubSubItems: ShellSubNavItem[] = [
    { label: 'My Business', icon: 'business', route: '/app/business-hub/my-business', category: 'default' },
    { label: 'Sales & Expenses', icon: 'analytics', route: '/app/business-hub/sales-expenses', category: 'default' },
    { label: 'Invoice Generator', icon: 'receipt_long', route: '/app/business-hub/invoice', category: 'default' },
    { label: 'My Stock', icon: 'inventory_2', route: '/app/business-hub/my-stock', category: 'default' },
    { label: 'Payment Reminder', icon: 'payments', route: '/app/business-hub/payment-reminder', category: 'default' },
    { label: 'Growth Checklist', icon: 'checklist', route: '/app/business-hub/growth-checklist', category: 'coming-soon' },
    { label: 'Hub Settings', icon: 'tune', route: '/app/business-hub/settings', category: 'default' },
  ];

  readonly sidebarItems: ShellNavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/app/dashboard', category: 'default' },
    { label: 'Business Hub', icon: 'grid_view', route: '/app/business-hub', category: 'default' },
    { label: 'Templates', icon: 'content_copy', route: '/app/templates', category: 'default' },
    { label: 'My website', icon: 'language', route: '/app/campaigns', category: 'default' },
    { label: 'Broadcast', icon: 'campaign', route: '/app/broadcast', category: 'default' },
    { label: 'Social', icon: 'travel_explore', route: '/app/social', category: 'default' },
    { label: 'Customers', icon: 'group', route: '/app/customers', category: 'default' },
    { label: 'Messages', icon: 'message', route: '/app/messages', category: 'default' },
    { label: 'Analytics', icon: 'query_stats', route: '/app/analytics', category: 'custom' },
    { label: 'Settings', icon: 'settings', route: '/app/settings', category: 'default' },
  ];

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly confirmDialogService: ConfirmDialogService,
    private readonly businessProfileService: BusinessProfileService,
    public readonly appResource: AppResourceService,
  ) { }

  ngOnInit(): void {
    this.syncSettingsMenu();
    this.syncBusinessHubMenu();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.syncSettingsMenu();
        this.syncBusinessHubMenu();
        this.mobileMenuOpen = false;
      });

    this.businessProfileService.getProfile().subscribe({
      error: () => {
        // Keep the shell usable when profile loading fails.
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get businessName(): string {
    const data = this.businessProfileService.profile();
    const name = String(data?.account?.businessName || 'Business').trim();
    return name.length > 36 ? `${name.substring(0, 36)}…` : name;
  }

  get businessTagName(): string {
    const data = this.businessProfileService.profile();
    const tagline = String(
      data?.profile?.tagline || data?.account?.businessCategory || 'Business workspace',
    ).trim();
    return tagline.length > 48 ? `${tagline.substring(0, 48)}…` : tagline;
  }

  get braintechnoLogo(): string {
    return this.appResource.images.logoMark;
  }

  get businessLogo(): string {
    const data = this.businessProfileService.profile();
    const uploadedLogo = String(data?.profile?.businessLogo || '').trim();
    return uploadedLogo || this.appResource.images.businessPlaceholder || this.braintechnoLogo;
  }

  getMenuCategory(category?: MenuCategory | string | null): MenuCategory {
    const normalized = String(category || '').trim().toLowerCase();
    const allowed: MenuCategory[] = [
      'default',
      'pro',
      'custom',
      'admin',
      'coming-soon',
      'disabled',
      'hidden',
    ];

    return allowed.includes(normalized as MenuCategory)
      ? normalized as MenuCategory
      : 'default';
  }

  isMenuHidden(category?: MenuCategory | string | null): boolean {
    return this.getMenuCategory(category) === 'hidden';
  }

  isMenuDisabled(category?: MenuCategory | string | null): boolean {
    const normalized = this.getMenuCategory(category);
    return normalized === 'disabled' || normalized === 'coming-soon';
  }

  getMenuCategoryLabel(category?: MenuCategory | string | null): string {
    const normalized = this.getMenuCategory(category);

    if (normalized === 'coming-soon') return 'Coming Soon';
    if (normalized === 'default') return '';

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }

  getMenuCategoryClass(category?: MenuCategory | string | null): string {
    return `menu-category--${this.getMenuCategory(category)}`;
  }

  openMenuItem(route: string, category?: MenuCategory | string | null): void {
    if (!route || this.isMenuDisabled(category) || this.isMenuHidden(category)) return;
    this.openPage(route);
  }

  logout(): void {
    this.confirmDialogService.confirm({
      title: 'Sign out?',
      subtitle: 'Are you sure you want to sign out of the application?',
      type: 'warning',
      icon: 'warning',
      successButtonName: 'Sign out',
      cancelButtonName: 'Cancel',
      showCancel: true,
      success: () => {
        this.auth.logout();
        void this.router.navigateByUrl('/auth/login');
      },
      cancel: () => {
        // User cancelled logout.
      },
    });
  }

  openPage(route: string): void {
    if (!route) return;
    this.mobileMenuOpen = false;
    void this.router.navigateByUrl(route);
  }

  private syncSettingsMenu(): void {
    this.settingsMenuOpen = this.router.url.startsWith('/app/settings');
  }

  private syncBusinessHubMenu(): void {
    this.businessHubMenuOpen = this.router.url.startsWith('/app/business-hub');
  }

  isBusinessHubActive(): boolean {
    return this.router.url.startsWith('/app/business-hub');
  }

  toggleBusinessHubMenu(): void {
    this.businessHubMenuOpen = !this.businessHubMenuOpen;
  }

  openBusinessHubPage(route: string, category?: MenuCategory | string | null): void {
    if (!route || this.isMenuDisabled(category) || this.isMenuHidden(category)) return;
    this.businessHubMenuOpen = true;
    this.mobileMenuOpen = false;
    void this.router.navigateByUrl(route);
  }

  toggleSettingsMenu(): void {
    this.settingsMenuOpen = !this.settingsMenuOpen;
  }

  openSettingsPage(route: string, category?: MenuCategory | string | null): void {
    if (!route || this.isMenuDisabled(category) || this.isMenuHidden(category)) return;
    this.settingsMenuOpen = true;
    this.mobileMenuOpen = false;
    void this.router.navigateByUrl(route);
  }

  isActive(route: string): boolean {
    if (!route) return false;
    if (route === '/app/dashboard') return this.router.url === route;
    return this.router.url === route || this.router.url.startsWith(`${route}/`);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  onBusinessLogoError(event: Event): void {
    const image = event.target as HTMLImageElement;
    const fallback = this.appResource.images.businessPlaceholder || this.braintechnoLogo;
    if (image.src === fallback || image.src.endsWith(fallback)) return;
    image.src = fallback;
  }
}
