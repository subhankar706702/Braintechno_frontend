import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterOutlet,
} from '@angular/router';

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
    {
      label: 'Subscription',
      icon: 'workspace_premium',
      route: '/app/pricing',
    },
  ];

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly confirmDialogService: ConfirmDialogService,
    private readonly businessProfileService: BusinessProfileService,
    public readonly appResource: AppResourceService,
  ) { }

  ngOnInit(): void {
    this.businessProfileService
      .getProfile()
      .subscribe({
        error: () => {
          // Keep shell usable even if profile loading fails.
        },
      });
  }

  get businessName(): string {
    const data =
      this.businessProfileService.profile();

    const name = String(
      data?.account?.businessName ||
      'Business',
    ).trim();

    return name.length > 22
      ? `${name.substring(0, 22)}...`
      : name;
  }

  get businessTagName(): string {
    const data =
      this.businessProfileService.profile();

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
    return this.appResource
      .images
      .logoMark;
  }

  get businessLogo(): string {
    const data =
      this.businessProfileService.profile();

    const uploadedLogo = String(
      data?.profile?.businessLogo ||
      '',
    ).trim();

    return uploadedLogo ||
      this.appResource
        .images
        .businessPlaceholder ||
      this.braintechnoLogo;
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

        void this.router.navigateByUrl(
          '/auth/login',
        );
      },

      cancel: () => {
        // User cancelled logout.
      },
    });
  }

  openPage(
    route: string,
  ): void {

    if (!route) {
      return;
    }

    this.mobileMenuOpen = false;

    void this.router.navigateByUrl(
      route,
    );
  }

  isActive(
    route: string,
  ): boolean {

    if (!route) {
      return false;
    }

    if (
      route === '/app/dashboard'
    ) {
      return this.router.url ===
        '/app/dashboard';
    }

    return this.router.url.startsWith(
      route,
    );
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen =
      !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  onBusinessLogoError(
    event: Event,
  ): void {

    const image =
      event.target as HTMLImageElement;

    const fallback =
      this.appResource
        .images
        .businessPlaceholder ||
      this.braintechnoLogo;

    if (
      image.src === fallback ||
      image.src.endsWith(fallback)
    ) {
      return;
    }

    image.src =
      fallback;
  }
}
