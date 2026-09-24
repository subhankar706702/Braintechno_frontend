import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  Router,
  RouterOutlet,
} from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/auth.service';
import { ConfirmDialogService } from '../../Common/components/confirm-dialog/confirm-dialog.service';

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
export class DashboardShellComponent {

  mobileMenuOpen = false;

  braintechnoLogo =
    '/assets/images/braintechno.png';

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
    public auth: AuthService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
  ) {}

  get businessName(): string {
    const user =
      this.auth.user() as any;

    const name = String(
      user?.businessName ||
      user?.name ||
      'BRAIN TECHNO',
    ).trim();

    return name.length > 15
      ? name.substring(0, 15) + '...'
      : name;
  }

  get businessTagName(): string {
    const user =
      this.auth.user() as any;

    const tagName = String(
      user?.businessTagName ||
      'Business workspace',
    ).trim();

    return tagName.length > 25
      ? tagName.substring(0, 25) + '...'
      : tagName;
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

  get businessLogo(): string {
    const user =
      this.auth.user() as any;

    const uploadedLogo = String(
      user?.business_logo_url ||
      user?.businessLogoUrl ||
      user?.business_logo ||
      user?.businessLogo ||
      user?.logo_url ||
      user?.logoUrl ||
      user?.logo ||
      user?.business?.logo_url ||
      user?.business?.logo ||
      '',
    ).trim();

    return uploadedLogo ||
      this.braintechnoLogo;
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

  onLogoError(
    event: Event,
  ): void {

    const image =
      event.target as HTMLImageElement;

    if (
      image.src.includes(
        this.braintechnoLogo,
      )
    ) {
      return;
    }

    image.src =
      this.braintechnoLogo;
  }
}