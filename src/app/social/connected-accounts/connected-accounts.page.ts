import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  MatIconModule,
} from '@angular/material/icon';

import {
  MatButtonModule,
} from '@angular/material/button';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import {
  SocialAccount,
  FacebookPageOption,
  SocialAccountService,
  SocialPlatform,
} from '../service/social-account.service';

interface SocialAccountCard {
  platform:
    | 'facebook'
    | 'instagram'
    | 'linkedin'
    | 'google_business';

  backendPlatform:
    SocialPlatform;

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
  selector:
    'app-connected-accounts',

  standalone: true,

  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],

  templateUrl:
    './connected-accounts.page.html',

  styleUrl:
    './connected-accounts.page.scss',

  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class ConnectedAccountsPage
  implements OnInit {

  readonly accounts:
    SocialAccountCard[] = [
      {
        platform:
          'facebook',

        backendPlatform:
          'Facebook',

        name:
          'Facebook',

        description:
          'Connect a Facebook Page to publish your social posts.',

        icon:
          'facebook',

        connected:
          false,
      },

      {
        platform:
          'instagram',

        backendPlatform:
          'Instagram',

        name:
          'Instagram',

        description:
          'Connect an Instagram account to publish promotional posts.',

        icon:
          'camera_alt',

        connected:
          false,
      },

      {
        platform:
          'linkedin',

        backendPlatform:
          'LinkedIn',

        name:
          'LinkedIn',

        description:
          'Connect your LinkedIn account or company presence.',

        icon:
          'business_center',

        connected:
          false,
      },

      {
        platform:
          'google_business',

        backendPlatform:
          'Google Business Profile',

        name:
          'Google Business',

        description:
          'Connect a Google Business Profile for local updates.',

        icon:
          'location_on',

        connected:
          false,
      },
    ];

  loading =
    false;

  actionPlatform:
    string | null =
      null;

  errorMessage =
    '';

  facebookPages:
    FacebookPageOption[] =
      [];

  facebookPageSelectionToken =
    '';

  selectingFacebookPage =
    false;

  constructor(
    private readonly socialAccountService:
      SocialAccountService,

    private readonly route:
      ActivatedRoute,

    private readonly router:
      Router,

    private readonly cdr:
      ChangeDetectorRef,
  ) {}

  ngOnInit():
    void {
    this.readOAuthResult();
    this.loadAccounts();
  }

  get connectedCount():
    number {
    return this.accounts.filter(
      account =>
        account.connected,
    ).length;
  }

  connect(
    account: SocialAccountCard,
  ): void {
    if (this.actionPlatform) {
      return;
    }

    if (
      account.platform !==
        'facebook' &&
      account.platform !==
        'instagram'
    ) {
      this.errorMessage =
        `${account.name} connection is not configured yet.`;

      this.cdr.markForCheck();

      return;
    }

    this.actionPlatform =
      account.platform;

    this.errorMessage =
      '';

    this.cdr.markForCheck();

    const start$ =
      account.platform ===
        'instagram'
        ? this.socialAccountService
            .startInstagramOAuth()
        : this.socialAccountService
            .startFacebookOAuth();

    start$.subscribe({
      next: ({
        authorizationUrl,
      }) => {
        if (!authorizationUrl) {
          this.actionPlatform =
            null;

          this.errorMessage =
            `${account.name} authorization URL was not returned.`;

          this.cdr.markForCheck();

          return;
        }

        /*
         * Important:
         *
         * OAuth start is called through HttpClient
         * so the JWT interceptor can attach the
         * Authorization header.
         *
         * After receiving the provider URL,
         * normal browser navigation is safe.
         */
        window.location.assign(
          authorizationUrl,
        );
      },

      error: (
        error: unknown,
      ) => {
        this.actionPlatform =
          null;

        this.errorMessage =
          this.getErrorMessage(
            error,
            `Unable to start ${account.name} connection.`,
          );

        this.cdr.markForCheck();
      },
    });
  }

  manage(
    account: SocialAccountCard,
  ): void {
    if (
      !account.connected ||
      this.actionPlatform
    ) {
      return;
    }

    /*
     * Manage flow can be expanded later.
     * Refreshing account data keeps the
     * existing UI stable for now.
     */
    this.loadAccounts();
  }

  disconnect(
    account: SocialAccountCard,
  ): void {
    if (
      !account.accountId ||
      this.actionPlatform
    ) {
      return;
    }

    this.actionPlatform =
      account.platform;

    this.errorMessage =
      '';

    this.cdr.markForCheck();

    this.socialAccountService
      .disconnectAccount(
        account.accountId,
      )
      .subscribe({
        next: () => {
          this.resetAccount(
            account,
          );

          this.actionPlatform =
            null;

          this.cdr.markForCheck();
        },

        error: (
          error: unknown,
        ) => {
          this.actionPlatform =
            null;

          this.errorMessage =
            this.getErrorMessage(
              error,
              `Unable to disconnect ${account.name}.`,
            );

          this.cdr.markForCheck();
        },
      });
  }

  private loadAccounts():
    void {
    this.loading =
      true;

    this.errorMessage =
      '';

    this.cdr.markForCheck();

    this.socialAccountService
      .getAccounts()
      .subscribe({
        next: (
          backendAccounts:any,
        ) => {
          this.applyBackendAccounts(
            backendAccounts,
          );

          this.loading =
            false;

          this.cdr.markForCheck();
        },

        error: (
          error: unknown,
        ) => {
          this.loading =
            false;

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Unable to load connected social accounts.',
            );

          this.cdr.markForCheck();
        },
      });
  }

  private readOAuthResult():
    void {
    const params =
      this.route.snapshot.queryParamMap;

    const status =
      params.get('status');

    const message =
      params.get('message');

    const social =
      params.get('social');

    const selectionToken =
      params.get(
        'selectionToken',
      );

    if (
      status ===
      'error'
    ) {
      const platformName =
        social === 'instagram'
          ? 'Instagram'
          : 'Facebook';

      this.errorMessage =
        message ||
        `${platformName} connection failed.`;

      return;
    }

    if (
      status ===
        'select_page' &&
      selectionToken
    ) {
      this.facebookPageSelectionToken =
        selectionToken;

      this.loadFacebookPages(
        selectionToken,
      );
    }
  }

  private loadFacebookPages(
    selectionToken: string,
  ):
    void {
    this.selectingFacebookPage =
      true;

    this.socialAccountService
      .getFacebookPages(
        selectionToken,
      )
      .subscribe({
        next: (
          response:any,
        ) => {
          this.facebookPages =
            response.pages || [];

          this.selectingFacebookPage =
            false;

          this.cdr.markForCheck();
        },

        error: (
          error: unknown,
        ) => {
          this.selectingFacebookPage =
            false;

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Unable to load Facebook Pages for selection.',
            );

          this.cdr.markForCheck();
        },
      });
  }

  selectFacebookPage(
    page: FacebookPageOption,
  ):
    void {
    if (
      this.selectingFacebookPage ||
      !this.facebookPageSelectionToken
    ) {
      return;
    }

    this.selectingFacebookPage =
      true;

    this.errorMessage =
      '';

    this.cdr.markForCheck();

    this.socialAccountService
      .selectFacebookPage(
        this.facebookPageSelectionToken,
        page.id,
      )
      .subscribe({
        next: () => {
          this.facebookPages =
            [];

          this.facebookPageSelectionToken =
            '';

          this.selectingFacebookPage =
            false;

          this.router.navigate(
            [],

            {
              relativeTo:
                this.route,

              queryParams: {},

              replaceUrl:
                true,
            },
          );

          this.loadAccounts();

          this.cdr.markForCheck();
        },

        error: (
          error: unknown,
        ) => {
          this.selectingFacebookPage =
            false;

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Unable to connect the selected Facebook Page.',
            );

          this.cdr.markForCheck();
        },
      });
  }

  private applyBackendAccounts(
    backendAccounts:
      SocialAccount[],
  ):
    void {
    for (
      const card of this.accounts
    ) {
      const backendAccount =
        backendAccounts.find(
          account =>
            account.platform ===
            card.backendPlatform,
        );

      if (!backendAccount) {
        this.resetAccount(
          card,
        );

        continue;
      }

      const connected =
        String(
          backendAccount.status,
        ).toLowerCase() ===
        'connected';

      card.connected =
        connected;

      card.accountName =
        backendAccount.accountName ||
        '';

      card.username =
        backendAccount.pageName ||
        backendAccount.accountName ||
        '';

      card.pageName =
        backendAccount.pageName ||
        '';

      card.accountId =
        backendAccount.id ||
        undefined;

      card.status =
        backendAccount.status ||
        'Not Connected';

      card.tokenExpiresAt =
        backendAccount.tokenExpiresAt ??
        null;
    }
  }

  private resetAccount(
    account: SocialAccountCard,
  ):
    void {
    account.connected =
      false;

    account.accountName =
      '';

    account.username =
      '';

    account.pageName =
      '';

    account.accountId =
      undefined;

    account.status =
      'Not Connected';

    account.tokenExpiresAt =
      null;
  }

  private getErrorMessage(
    error: unknown,
    fallback: string,
  ):
    string {
    if (
      typeof error ===
        'object' &&
      error !== null
    ) {
      const apiError =
        error as {
          error?: {
            message?: unknown;
          };

          message?: unknown;
        };

      if (
        apiError.error?.message
      ) {
        return String(
          apiError.error.message,
        );
      }

      if (
        apiError.message
      ) {
        return String(
          apiError.message,
        );
      }
    }

    return fallback;
  }
}