import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

type SocialPlatform = 'Facebook' | 'Instagram' | 'LinkedIn' | 'Google Business';

type SocialStat = {
  label: string;
  value: number;
  icon: string;
  tone: 'primary' | 'warning' | 'success' | 'neutral';
};

type ConnectedAccount = {
  platform: SocialPlatform;
  username: string;
  connected: boolean;
  icon: string;
};

type RecentPost = {
  id: number;
  caption: string;
  platform: SocialPlatform;
  status: 'Draft' | 'Scheduled' | 'Published' | 'Failed';
  date: string;
};

@Component({
  selector: 'bt-social-overview-page',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './social-overview.page.html',
  styleUrl: './social-overview.page.scss',
})
export class SocialOverviewPage {
  private readonly router = inject(Router);

  /**
   * Temporary overview data.
   * The Social backend/API is not implemented in the current project yet.
   * These values can be replaced by SocialOverviewService later without
   * changing the page structure.
   */
  readonly stats: SocialStat[] = [
    { label: 'Total Posts', value: 0, icon: 'article', tone: 'primary' },
    { label: 'Scheduled Posts', value: 0, icon: 'schedule', tone: 'warning' },
    { label: 'Published Posts', value: 0, icon: 'check_circle', tone: 'success' },
    { label: 'Draft Posts', value: 0, icon: 'edit_note', tone: 'neutral' },
  ];

  readonly connectedAccounts: ConnectedAccount[] = [
    { platform: 'Facebook', username: '', connected: false, icon: 'facebook' },
    { platform: 'Instagram', username: '', connected: false, icon: 'photo_camera' },
    { platform: 'LinkedIn', username: '', connected: false, icon: 'business_center' },
    { platform: 'Google Business', username: '', connected: false, icon: 'storefront' },
  ];

  readonly recentPosts: RecentPost[] = [];

  readonly platformSummary: Array<{
    platform: SocialPlatform;
    posts: number;
    icon: string;
  }> = [
    { platform: 'Facebook', posts: 0, icon: 'facebook' },
    { platform: 'Instagram', posts: 0, icon: 'photo_camera' },
    { platform: 'LinkedIn', posts: 0, icon: 'business_center' },
    { platform: 'Google Business', posts: 0, icon: 'storefront' },
  ];

  get connectedCount(): number {
    return this.connectedAccounts.filter(account => account.connected).length;
  }

  get totalPlatforms(): number {
    return this.connectedAccounts.length;
  }

  back(): void {
    this.router.navigate(['/app/dashboard']);
  }

  openConnectedAccounts(): void {
    this.router.navigate(['/app/social/connected-accounts']);
  }

  openCreatePost(): void {
    this.router.navigate(['/app/social/create-post']);
  }

  openScheduled(): void {
    this.router.navigate(['/app/social/scheduled']);
  }

  openPublished(): void {
    this.router.navigate(['/app/social/published']);
  }

  openPlatform(platform: SocialPlatform): void {
    const routeMap: Record<SocialPlatform, string> = {
      Facebook: '/app/social/facebook',
      Instagram: '/app/social/instagram',
      LinkedIn: '/app/social/linkedin',
      'Google Business': '/app/social/google-business',
    };

    this.router.navigate([routeMap[platform]]);
  }
}
