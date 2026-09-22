import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  Router,
  RouterOutlet,
} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
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
export class DashboardShellComponent {

  mobileMenuOpen = false;

  readonly sidebarItems: ShellNavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/app/dashboard',
    },
    {
      label: 'Templates',
      icon: 'dashboard_customize',
      route: '/app/templates',
    },
    {
      label: 'Campaigns',
      icon: 'campaign',
      route: '/app/campaigns',
    },
  ];

  constructor(
    public auth: AuthService,
    private router: Router,
  ) { }

  get businessName(): string {
    const user = this.auth.user() as any;

    return String(
      user?.business_name ||
      user?.businessName ||
      user?.business?.name ||
      user?.company_name ||
      user?.companyName ||
      user?.name ||
      'BRAIN TECHNO'
    ).trim();
  }

  get businessLogo(): string {
    const user = this.auth.user() as any;

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
      ''
    ).trim();

    return uploadedLogo || 'assets/logo/braintechno.png';
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

    if (route === '/app/dashboard') {
      return this.router.url === '/app/dashboard';
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
        '/assets/logo/braintechno.png'
      )) {
      return;
    }

    image.src =
      '/assets/logo/braintechno.png'
  }
}
