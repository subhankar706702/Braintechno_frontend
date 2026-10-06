import {
  CommonModule,
} from '@angular/common';

import {
  Component,
  OnInit,
  inject,
} from '@angular/core';

import {
  FormsModule,
} from '@angular/forms';

import {
  finalize,
} from 'rxjs';

import {
  SocialAccountService,
  SocialAccount,
} from '../service/social-account.service';

import {
  SocialPostService,
  SocialPostPayload,
  SocialPostPlatform,
} from '../service/social-post.service';

type PlatformKey =
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'google_business';

interface PlatformOption {
  key: PlatformKey;
  name: string;
  shortName: string;
  connected: boolean;
  accountName?: string;
  backendPlatform: SocialPostPlatform;
}

@Component({
  selector:
    'app-create-social-post',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
  ],

  templateUrl:
    './create-social-post.page.html',

  styleUrl:
    './create-social-post.page.scss',
})
export class CreateSocialPostPage
  implements OnInit {

  private readonly accountService =
    inject(SocialAccountService);

  private readonly postService =
    inject(SocialPostService);

  platforms: PlatformOption[] = [
    {
      key: 'instagram',
      name: 'Instagram',
      shortName: 'IG',
      connected: false,
      backendPlatform: 'Instagram',
    },

    {
      key: 'facebook',
      name: 'Facebook',
      shortName: 'FB',
      connected: false,
      backendPlatform: 'Facebook',
    },

    {
      key: 'linkedin',
      name: 'LinkedIn',
      shortName: 'in',
      connected: false,
      backendPlatform: 'LinkedIn',
    },

    {
      key: 'google_business',
      name: 'Google Business',
      shortName: 'G',
      connected: false,
      backendPlatform:
        'Google Business Profile',
    },
  ];

  postToAll = false;

  selectedPlatforms:
    PlatformKey[] = [];

  caption = '';
  link = '';
  hashtags = '';
  cta = '';

  imagePreview:
    string | null = null;

  imageName = '';

  scheduleEnabled = false;

  scheduledDate = '';
  scheduledTime = '';

  loading = false;

  savingDraft = false;

  scheduling = false;

  publishing = false;

  errorMessage = '';

  successMessage = '';

  readonly ctaOptions = [
    'None',
    'Learn More',
    'Shop Now',
    'Book Now',
    'Contact Us',
    'Get Offer',
    'Sign Up',
  ];

  get connectedPlatforms():
    PlatformOption[] {
    return this.platforms.filter(
      platform =>
        platform.connected,
    );
  }

  get hasSelectedPlatform():
    boolean {
    return (
      this.postToAll ||
      this.selectedPlatforms.length >
        0
    );
  }

  get canPublish(): boolean {
    return (
      this.hasSelectedPlatform &&
      !!this.caption.trim() &&
      !this.loading
    );
  }

  ngOnInit(): void {
    this.loadConnectedAccounts();
  }

  private loadConnectedAccounts():
    void {
    this.accountService
      .getAccounts()
      .subscribe({
        next: accounts => {
          this.applyConnectedAccounts(
            accounts,
          );
        },

        error: error => {
          console.error(
            '[SOCIAL][CREATE POST][ACCOUNTS]',
            error,
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to load connected social accounts.';
        },
      });
  }

  private applyConnectedAccounts(
    accounts: SocialAccount[],
  ): void {
    this.platforms =
      this.platforms.map(
        platform => {
          const account =
            accounts.find(
              item =>
                item.platform ===
                platform.backendPlatform,
            );

          const connected =
            account?.status ===
            'Connected';

          return {
            ...platform,
            connected,
            accountName:
              account?.accountName ||
              account?.pageName ||
              '',
          };
        },
      );

    /*
     * Remove selections if an account
     * became disconnected.
     */
    const connectedKeys =
      new Set(
        this.connectedPlatforms.map(
          platform =>
            platform.key,
        ),
      );

    this.selectedPlatforms =
      this.selectedPlatforms.filter(
        key =>
          connectedKeys.has(key),
      );

    if (
      this.postToAll &&
      this.connectedPlatforms.length ===
        0
    ) {
      this.postToAll = false;
    }
  }

  toggleAllPlatforms(): void {
    if (
      this.connectedPlatforms.length ===
      0
    ) {
      return;
    }

    this.postToAll =
      !this.postToAll;

    if (this.postToAll) {
      this.selectedPlatforms =
        this.connectedPlatforms.map(
          platform =>
            platform.key,
        );
    } else {
      this.selectedPlatforms = [];
    }
  }

  togglePlatform(
    platform: PlatformOption,
  ): void {
    if (!platform.connected) {
      return;
    }

    this.postToAll = false;

    const index =
      this.selectedPlatforms.indexOf(
        platform.key,
      );

    if (index === -1) {
      this.selectedPlatforms = [
        ...this.selectedPlatforms,
        platform.key,
      ];
    } else {
      this.selectedPlatforms =
        this.selectedPlatforms.filter(
          key =>
            key !== platform.key,
        );
    }

    if (
      this.connectedPlatforms.length >
        0 &&
      this.selectedPlatforms.length ===
        this.connectedPlatforms.length
    ) {
      this.postToAll = true;
    }
  }

  isPlatformSelected(
    platform: PlatformOption,
  ): boolean {
    return (
      this.postToAll ||
      this.selectedPlatforms.includes(
        platform.key,
      )
    );
  }

  onImageSelected(
    event: Event,
  ): void {
    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0
    ) {
      return;
    }

    const file =
      input.files[0];

    if (
      !file.type.startsWith(
        'image/',
      )
    ) {
      this.errorMessage =
        'Please select a valid image file.';

      return;
    }

    this.errorMessage = '';

    this.imageName =
      file.name;

    const reader =
      new FileReader();

    reader.onload = () => {
      this.imagePreview =
        typeof reader.result ===
        'string'
          ? reader.result
          : null;
    };

    reader.readAsDataURL(
      file,
    );
  }

  removeImage(): void {
    this.imagePreview = null;
    this.imageName = '';
  }

  get selectedPlatformNames():
    string {
    if (this.postToAll) {
      return this.connectedPlatforms
        .map(
          platform =>
            platform.name,
        )
        .join(', ');
    }

    return this.selectedPlatforms
      .map(
        key =>
          this.platforms.find(
            platform =>
              platform.key ===
              key,
          )?.name,
      )
      .filter(
        (
          value,
        ): value is string =>
          !!value,
      )
      .join(', ');
  }

  private getBackendPlatforms():
    SocialPostPlatform[] {
    if (this.postToAll) {
      return this.connectedPlatforms.map(
        platform =>
          platform.backendPlatform,
      );
    }

    return this.selectedPlatforms
      .map(
        key =>
          this.platforms.find(
            platform =>
              platform.key ===
              key,
          )?.backendPlatform,
      )
      .filter(
        (
          value,
        ): value is SocialPostPlatform =>
          !!value,
      );
  }

  private buildPayload(
    status:
      | 'Draft'
      | 'Scheduled',
  ): SocialPostPayload {
    const payload:
      SocialPostPayload = {
      postTo:
        this.getBackendPlatforms(),

      postToAll:
        this.postToAll,

      content: {
        caption:
          this.caption.trim(),

        link:
          this.link.trim(),

        hashtags:
          this.hashtags.trim(),

        cta:
          this.cta.trim(),
      },

      media: {
        original: {
          name:
            this.imageName,
        },
      },

      status,
    };

    if (
      status === 'Scheduled'
    ) {
      payload.scheduledAt =
        this.getScheduledIso();
    }

    return payload;
  }

  private getScheduledIso():
    string | null {
    if (
      !this.scheduledDate ||
      !this.scheduledTime
    ) {
      return null;
    }

    const localDate =
      new Date(
        `${this.scheduledDate}T${this.scheduledTime}`,
      );

    if (
      Number.isNaN(
        localDate.getTime(),
      )
    ) {
      return null;
    }

    return localDate.toISOString();
  }

  private resetMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  publishNow(): void {
    if (!this.canPublish) {
      return;
    }

    this.resetMessages();

    const platforms =
      this.getBackendPlatforms();

    if (!platforms.length) {
      this.errorMessage =
        'Select at least one connected platform.';

      return;
    }

    this.publishing = true;
    this.loading = true;

    /*
     * First create the post as a draft.
     * Real provider publishing is intentionally
     * separated and will be enabled later.
     */
    this.postService
      .createPost(
        this.buildPayload(
          'Draft',
        ),
      )
      .pipe(
        finalize(() => {
          this.publishing =
            false;

          this.loading =
            false;
        }),
      )
      .subscribe({
        next: post => {
          this.successMessage =
            `Post saved as draft (${post._id}). Live publishing will be enabled after provider setup.`;
        },

        error: error => {
          console.error(
            '[SOCIAL][CREATE POST]',
            error,
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to create the social post.';
        },
      });
  }

  schedulePost(): void {
    if (
      !this.canPublish ||
      !this.scheduledDate ||
      !this.scheduledTime
    ) {
      return;
    }

    this.resetMessages();

    const scheduledAt =
      this.getScheduledIso();

    if (!scheduledAt) {
      this.errorMessage =
        'Please select a valid future date and time.';

      return;
    }

    if (
      new Date(
        scheduledAt,
      ).getTime() <=
      Date.now()
    ) {
      this.errorMessage =
        'Scheduled time must be in the future.';

      return;
    }

    this.scheduling = true;
    this.loading = true;

    this.postService
      .createPost(
        this.buildPayload(
          'Scheduled',
        ),
      )
      .pipe(
        finalize(() => {
          this.scheduling =
            false;

          this.loading =
            false;
        }),
      )
      .subscribe({
        next: () => {
          this.successMessage =
            'Social post scheduled successfully.';
        },

        error: error => {
          console.error(
            '[SOCIAL][SCHEDULE POST]',
            error,
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to schedule the social post.';
        },
      });
  }

  saveDraft(): void {
    this.resetMessages();

    const platforms =
      this.getBackendPlatforms();

    /*
     * Draft can be saved even before caption
     * is complete, but platform selection is
     * still required because the post belongs
     * to selected social destinations.
     */
    if (!platforms.length) {
      this.errorMessage =
        'Select at least one connected platform before saving the draft.';

      return;
    }

    this.savingDraft = true;
    this.loading = true;

    this.postService
      .createPost(
        this.buildPayload(
          'Draft',
        ),
      )
      .pipe(
        finalize(() => {
          this.savingDraft =
            false;

          this.loading =
            false;
        }),
      )
      .subscribe({
        next: () => {
          this.successMessage =
            'Social post draft saved successfully.';
        },

        error: error => {
          console.error(
            '[SOCIAL][SAVE DRAFT]',
            error,
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to save social post draft.';
        },
      });
  }
}