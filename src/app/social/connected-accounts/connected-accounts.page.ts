import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import {
  SocialPlatform,
  BackendSocialPlatform,
  SocialAccountService,
  SocialAccount,
} from '../service/social-account.service';

interface SocialAccountCard {
  platform: SocialPlatform;
  backendPlatform: BackendSocialPlatform;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  accountName?: string;
  username?: string;
  pageName?: string;
  accountId?: string;
  status?: string;
  tokenExpiresAt?: string | null;
}

@Component({
  selector: 'app-connected-accounts',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './connected-accounts.page.html',
  styleUrl: './connected-accounts.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectedAccountsPage implements OnInit {

  readonly accounts: SocialAccountCard[] = [
    {
      platform: 'facebook',
      backendPlatform: 'Facebook',
      name: 'Facebook',
      description:
        'Connect a Facebook Page to publish your social posts.',
      icon: 'facebook',
      connected: false,
    },
    {
      platform: 'instagram',
      backendPlatform: 'Instagram',
      name: 'Instagram',
      description:
        'Connect an Instagram account to publish promotional posts.',
      icon: 'camera_alt',
      connected: false,
    },
    {
      platform: 'linkedin',
      backendPlatform: 'LinkedIn',
      name: 'LinkedIn',
      description:
        'Connect your LinkedIn account or company presence.',
      icon: 'business_center',
      connected: false,
    },
    {
      platform: 'google_business',
      backendPlatform: 'Google Business Profile',
      name: 'Google Business',
      description:
        'Connect a Google Business Profile for local updates.',
      icon: 'location_on',
      connected: false,
    },
  ];

  loading = false;
  actionPlatform: SocialPlatform | null = null;
  errorMessage = '';

  constructor(
    private readonly socialAccountService: SocialAccountService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  get connectedCount(): number {
    return this.accounts.filter(
      account => account.connected
    ).length;
  }

  /**
   * Load all social accounts from backend.
   */
  loadAccounts(): void {
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.socialAccountService.getAccounts().subscribe({
      next: (backendAccounts: SocialAccount[]) => {
        this.applyBackendAccounts(backendAccounts);

        this.loading = false;
        this.cdr.markForCheck();
      },

      error: (error: unknown) => {
        this.loading = false;

        this.errorMessage = this.getErrorMessage(
          error,
          'Unable to load connected social accounts.'
        );

        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Connect button.
   *
   * The actual OAuth flow is not implemented yet.
   * Do NOT call POST /connect with fake account data.
   *
   * Correct future flow:
   *
   * Connect
   *   ↓
   * Backend OAuth start endpoint
   *   ↓
   * Social provider
   *   ↓
   * OAuth callback
   *   ↓
   * Account/Page selection
   *   ↓
   * POST /social/accounts/connect
   */
  connect(account: SocialAccountCard): void {
    if (this.actionPlatform) {
      return;
    }

    this.errorMessage = '';

    /*
     * OAuth start endpoint should be called here
     * after the backend OAuth route is implemented.
     *
     * Example future call:
     *
     * this.socialAccountService.startOAuth(account.backendPlatform)
     *
     * Do not call connectAccount() here because that API
     * requires real OAuth account information.
     */

    this.errorMessage =
      `${account.name} OAuth connection is not configured yet.`;

    this.cdr.markForCheck();
  }

  /**
   * Manage connected account.
   */
  manage(account: SocialAccountCard): void {
    if (!account.connected) {
      return;
    }

    if (this.actionPlatform) {
      return;
    }

    this.errorMessage = '';

    /*
     * For now refresh the backend state.
     * Provider-specific Manage/OAuth flow can be connected later.
     */
    this.loadAccounts();
  }

  /**
   * Disconnect connected account.
   */
  disconnect(account: SocialAccountCard): void {
    if (!account.accountId) {
      return;
    }

    if (this.actionPlatform) {
      return;
    }

    this.actionPlatform = account.platform;
    this.errorMessage = '';

    this.socialAccountService
      .disconnectAccount(account.accountId)
      .subscribe({
        next: () => {
          account.connected = false;
          account.accountName = '';
          account.username = '';
          account.pageName = '';
          account.accountId = undefined;
          account.status = 'Not Connected';
          account.tokenExpiresAt = null;

          this.actionPlatform = null;

          this.cdr.markForCheck();
        },

        error: (error: unknown) => {
          this.actionPlatform = null;

          this.errorMessage = this.getErrorMessage(
            error,
            `Unable to disconnect ${account.name}.`
          );

          this.cdr.markForCheck();
        },
      });
  }

  /**
   * Map backend accounts to frontend cards.
   */
  private applyBackendAccounts(
    backendAccounts: SocialAccount[]
  ): void {

    for (const card of this.accounts) {

      const backendAccount = backendAccounts.find(
        account =>
          this.normalisePlatform(account.platform) ===
          card.platform
      );

      if (!backendAccount) {
        this.resetAccount(card);
        continue;
      }

      const connected =
        this.normaliseStatus(backendAccount.status) ===
        'connected';

      card.connected = connected;
      card.accountName =
        backendAccount.accountName || '';
      card.username =
        backendAccount.pageName ||
        backendAccount.accountName ||
        '';
      card.pageName =
        backendAccount.pageName || '';
      card.accountId =
        backendAccount.id || undefined;
      card.status =
        backendAccount.status || 'Not Connected';
      card.tokenExpiresAt =
        backendAccount.tokenExpiresAt ?? null;
    }
  }

  /**
   * Reset frontend account state.
   */
  private resetAccount(
    account: SocialAccountCard
  ): void {
    account.connected = false;
    account.accountName = '';
    account.username = '';
    account.pageName = '';
    account.accountId = undefined;
    account.status = 'Not Connected';
    account.tokenExpiresAt = null;
  }

  /**
   * Convert backend platform name to frontend platform key.
   */
  private normalisePlatform(
    platform: BackendSocialPlatform
  ): SocialPlatform {

    switch (platform) {
      case 'Facebook':
        return 'facebook';

      case 'Instagram':
        return 'instagram';

      case 'LinkedIn':
        return 'linkedin';

      case 'Google Business Profile':
        return 'google_business';

      default:
        return 'facebook';
    }
  }

  /**
   * Normalise backend status.
   */
  private normaliseStatus(
    status: string | null | undefined
  ): string {
    return String(status ?? '')
      .trim()
      .toLowerCase();
  }

  /**
   * Extract readable API error.
   */
  private getErrorMessage(
    error: unknown,
    fallback: string
  ): string {

    if (
      typeof error === 'object' &&
      error !== null
    ) {
      const apiError = error as {
        error?: {
          message?: unknown;
        };
        message?: unknown;
      };

      if (apiError.error?.message) {
        return String(apiError.error.message);
      }

      if (apiError.message) {
        return String(apiError.message);
      }
    }

    return fallback;
  }
}