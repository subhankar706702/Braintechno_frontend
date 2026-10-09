import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs/operators';

import { MatIconModule } from '@angular/material/icon';

import { ConfirmDialogService } from '../../Common/components/confirm-dialog/confirm-dialog.service';
import { BusinessProfileService } from '../../dashboard/business-profile/business-profile.service';
import { AppResourceService } from '../../core/app-resource.service';
import { AuthService } from '../../core/auth.service';

type ShellNavItem = {
  label: string;
  icon: string;
  route: string;
};

type ShellSubNavItem = {
  label: string;
  icon: string;
  route: string;
};

@Component({
  selector: 'bt-dashboard-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatIconModule,
  ],
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss',
})
export class DashboardShellComponent implements OnInit {
  mobileMenuOpen = false;
  settingsMenuOpen = false;

  readonly settingsSubItems: ShellSubNavItem[] = [
    {
      label: 'Appearance',
      icon: 'light_mode',
      route: '/app/settings/appearance',
    },
    {
      label: 'Language & Region',
      icon: 'language',
      route: '/app/settings/language',
    },
    {
      label: 'Notifications',
      icon: 'notifications_none',
      route: '/app/settings/notifications',
    },
    {
      label: 'Editor Preferences',
      icon: 'edit_square',
      route: '/app/settings/editor',
    },
    {
      label: 'Accessibility',
      icon: 'accessibility_new',
      route: '/app/settings/accessibility',
    },
    {
      label: 'Privacy & Data',
      icon: 'shield',
      route: '/app/settings/privacy',
    },
    {
      label: 'Security',
      icon: 'lock',
      route: '/app/settings/security',
    },
    {
      label: 'System',
      icon: 'info',
      route: '/app/settings/system',
    },
    {
      label: 'Subscription & Plans',
      icon: 'workspace_premium',
      route: '/app/settings/pricing',
    },
    {
      label: 'Payment History',
      icon: 'receipt_long',
      route: '/app/settings/payment-history',
    },
  ];

  readonly sidebarItems: ShellNavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/app/dashboard',
    },
    {
      label: 'Templates',
      icon: 'content_copy',
      route: '/app/templates',
    },
    {
      label: 'My website',
      icon: 'language',
      route: '/app/campaigns',
    },
    {
      label: 'Broadcast',
      icon: 'campaign',
      route: '/app/broadcast',
    },
    {
      label: 'Social',
      icon: 'travel_explore',
      route: '/app/social',
    },
    {
      label: 'Customers',
      icon: 'group',
      route: '/app/customers',
    },
    {
      label: 'Messages',
      icon: 'message',
      route: '/app/messages',
    },
    {
      label: 'Analytics',
      icon: 'query_stats',
      route: '/app/analytics',
    },
    {
      label: 'Settings',
      icon: 'settings',
      route: '/app/settings',
    },
  ];

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly confirmDialogService: ConfirmDialogService,
    private readonly businessProfileService: BusinessProfileService,
    public readonly appResource: AppResourceService,
  ) {}

  ngOnInit(): void {
    this.syncSettingsMenu();

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd,
        ),
      )
      .subscribe(() => {
        this.syncSettingsMenu();
      });

    this.businessProfileService.getProfile().subscribe({
      error: () => {
        // Keep shell usable even if profile loading fails.
      },
    });
  }

  get businessName(): string {
    const data = this.businessProfileService.profile();

    const name = String(
      data?.account?.businessName || 'Business',
    ).trim();

    return name.length > 22
      ? `${name.substring(0, 22)}...`
      : name;
  }

  get businessTagName(): string {
    const data = this.businessProfileService.profile();

    const tagline = String(
      data?.profile?.tagline ||
      data?.account?.businessCategory ||
      'Business workspace',
    ).trim();

    return tagline.length > 30
      ? `${tagline.substring(0, 30)}...`
      : tagline;
  }

  get braintechnoLogo(): string {
    return this.appResource.images.logoMark;
  }

  get businessLogo(): string {
    const data = this.businessProfileService.profile();

    const uploadedLogo = String(
      data?.profile?.businessLogo || '',
    ).trim();

    return (
      uploadedLogo ||
      this.appResource.images.businessPlaceholder ||
      this.braintechnoLogo
    );
  }

  logout(): void {
    this.confirmDialogService.confirm({
      title: 'Sign out?',
      subtitle:
        'Are you sure you want to sign out of the application?',
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
    if (!route) {
      return;
    }

    this.mobileMenuOpen = false;

    void this.router.navigateByUrl(route);
  }

  private syncSettingsMenu(): void {
    const url = this.router.url;

    this.settingsMenuOpen = url.startsWith('/app/settings');
  }

  toggleSettingsMenu(): void {
    this.settingsMenuOpen = !this.settingsMenuOpen;
  }

  openSettingsPage(route: string): void {
    if (!route) {
      return;
    }

    this.settingsMenuOpen = true;
    this.mobileMenuOpen = false;

    void this.router.navigateByUrl(route);
  }

  isActive(route: string): boolean {
    if (!route) {
      return false;
    }

    if (route === '/app/dashboard') {
      return this.router.url === '/app/dashboard';
    }

    return this.router.url.startsWith(route);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  onBusinessLogoError(event: Event): void {
    const image = event.target as HTMLImageElement;

    const fallback =
      this.appResource.images.businessPlaceholder ||
      this.braintechnoLogo;

    if (
      image.src === fallback ||
      image.src.endsWith(fallback)
    ) {
      return;
    }

    image.src = fallback;
  }
}