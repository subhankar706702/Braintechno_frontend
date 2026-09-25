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

  readonly currentYear = new Date().getFullYear();

  readonly braintechnoLogo =
    '/assets/images/braintechno-mark.png';

  readonly sidebarItems: ShellNavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/app/dashboard',
    },
    {
      label: 'Templates',
      icon: 'book_4',
      route: '/app/templates',
    },
    {
      label: 'Campaigns',
      icon: 'campaign',
      route: '/app/campaigns',
    },
    {
      label: 'Campaign Outreach',
      icon: 'outgoing_mail',
      route: '/app/campaign-outreach',
    },
    {
      label: 'Customers',
      icon: 'contacts_product',
      route: '/app/customers',
    },
    {
      label: 'Messages',
      icon: 'chat',
      route: '/app/messages',
    },
    {
      label: 'Social',
      icon: 'travel_explore',
      route: '/app/social',
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
    private auth: AuthService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    private businessProfileService: BusinessProfileService,
  ) {}

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

  get businessLogo(): string {
    const data =
      this.businessProfileService.profile();

    const uploadedLogo = String(
      data?.profile?.businessLogo || '',
    ).trim();

    return uploadedLogo ||
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

    if (
      image.src.endsWith(
        this.braintechnoLogo,
      )
    ) {
      return;
    }

    image.src =
      this.braintechnoLogo;
  }
}
