import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface SocialPost {
  id: number;
  caption: string;
  publishedAt?: string;
  scheduledAt?: string;
  status: 'Published' | 'Scheduled';
}

@Component({
  selector: 'app-google-business',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-business.page.html',
  styleUrl: './google-business.page.scss'
})
export class GoogleBusinessPage {
  back(): void {
    this.router.navigate(['/app/social']);
  }


  isConnected = false;

  businessName = 'Google Business Profile';
  locationName = '';

  recentPosts: SocialPost[] = [];
  scheduledPosts: SocialPost[] = [];

  constructor(private router: Router) {}

  connectGoogleBusiness(): void {
    // Google Business Profile OAuth will be connected from the backend.
  }

  disconnectGoogleBusiness(): void {
    this.isConnected = false;
    this.locationName = '';
  }

  createPost(): void {
    this.router.navigate(['/app/social/create-post']);
  }

  viewScheduled(): void {
    this.router.navigate(['/app/social/scheduled']);
  }

  viewPublished(): void {
    this.router.navigate(['/app/social/published']);
  }
}
