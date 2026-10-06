import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'google_business';

interface PlatformOption {
  key: SocialPlatform;
  name: string;
  shortName: string;
  connected: boolean;
  accountName?: string;
}

@Component({
  selector: 'app-create-social-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-social-post.page.html',
  styleUrl: './create-social-post.page.scss'
})
export class CreateSocialPostPage {
  platforms: PlatformOption[] = [
    {
      key: 'instagram',
      name: 'Instagram',
      shortName: 'IG',
      connected: false
    },
    {
      key: 'facebook',
      name: 'Facebook',
      shortName: 'FB',
      connected: false
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      shortName: 'in',
      connected: false
    },
    {
      key: 'google_business',
      name: 'Google Business',
      shortName: 'G',
      connected: false
    }
  ];

  postToAll = false;
  selectedPlatforms: SocialPlatform[] = [];

  caption = '';
  link = '';
  hashtags = '';
  cta = '';

  imagePreview: string | null = null;
  imageName = '';

  scheduleEnabled = false;
  scheduledDate = '';
  scheduledTime = '';

  readonly ctaOptions = [
    'None',
    'Learn More',
    'Shop Now',
    'Book Now',
    'Contact Us',
    'Get Offer',
    'Sign Up'
  ];

  get connectedPlatforms(): PlatformOption[] {
    return this.platforms.filter(platform => platform.connected);
  }

  get hasSelectedPlatform(): boolean {
    return this.postToAll || this.selectedPlatforms.length > 0;
  }

  get canPublish(): boolean {
    return this.hasSelectedPlatform && !!this.caption.trim();
  }

  toggleAllPlatforms(): void {
    this.postToAll = !this.postToAll;

    if (this.postToAll) {
      this.selectedPlatforms = this.connectedPlatforms.map(platform => platform.key);
    } else {
      this.selectedPlatforms = [];
    }
  }

  togglePlatform(platform: PlatformOption): void {
    if (!platform.connected) {
      return;
    }

    this.postToAll = false;

    const index = this.selectedPlatforms.indexOf(platform.key);

    if (index === -1) {
      this.selectedPlatforms = [...this.selectedPlatforms, platform.key];
    } else {
      this.selectedPlatforms = this.selectedPlatforms.filter(key => key !== platform.key);
    }

    if (
      this.connectedPlatforms.length > 0 &&
      this.selectedPlatforms.length === this.connectedPlatforms.length
    ) {
      this.postToAll = true;
    }
  }

  isPlatformSelected(platform: PlatformOption): boolean {
    return this.postToAll || this.selectedPlatforms.includes(platform.key);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      return;
    }

    this.imageName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = typeof reader.result === 'string' ? reader.result : null;
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imagePreview = null;
    this.imageName = '';
  }

  get selectedPlatformNames(): string {
    if (this.postToAll) {
      return this.connectedPlatforms.map(platform => platform.name).join(', ');
    }

    return this.selectedPlatforms
      .map(key => this.platforms.find(platform => platform.key === key)?.name)
      .filter(Boolean)
      .join(', ');
  }

  publishNow(): void {
    if (!this.canPublish) {
      return;
    }

    // Backend publishing will be connected in the publishing/API step.
  }

  schedulePost(): void {
    if (!this.canPublish || !this.scheduledDate || !this.scheduledTime) {
      return;
    }

    // Backend scheduling will be connected in the scheduling/API step.
  }

  saveDraft(): void {
    // Draft API will be connected when the Social Post backend is added.
  }
}
