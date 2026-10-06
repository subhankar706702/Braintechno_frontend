import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface SocialPreviewPlatform {
  id: string;
  name: string;
  icon?: string;
}

@Component({
  selector: 'app-social-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-preview.component.html',
  styleUrls: ['./social-preview.component.scss']
})
export class SocialPreviewComponent {
  @Input() imageUrl = '';
  @Input() caption = '';
  @Input() link = '';
  @Input() hashtags = '';
  @Input() cta = '';
  @Input() platform = 'Instagram';
  @Input() accountName = 'Your Account';

  get platformLabel(): string {
    return this.platform || 'Social Media';
  }

  get captionText(): string {
    return this.caption?.trim() || 'Your caption will appear here...';
  }

  get hashtagText(): string {
    return this.hashtags?.trim() || '';
  }

  get ctaText(): string {
    return this.cta?.trim() || '';
  }

  get linkText(): string {
    return this.link?.trim() || '';
  }

  get platformIcon(): string {
    const icons: Record<string, string> = {
      Instagram: '◎',
      Facebook: 'f',
      LinkedIn: 'in',
      'Google Business': 'G'
    };

    return icons[this.platformLabel] || '●';
  }
}
