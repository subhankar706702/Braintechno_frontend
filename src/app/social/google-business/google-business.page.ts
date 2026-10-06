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
  isConnected = false;

  businessName = 'Google Business Profile';
  locationName = '';

  recentPosts: SocialPost[] = [];
  scheduledPosts: SocialPost[] = [];

  constructor(private router: Router) {}

  connectGoogleBusiness(): void {
    // OAuth / Google Business Profile connection will be implemented with backend.
    this.isConnected = true;
    this.locationName = 'Business Location';
  }

  disconnectGoogleBusiness(): void {
    this.isConnected = false;
    this.locationName = '';
  }

  createPost(): void {
    this.router.navigate(['/social/create-post']);
  }

  viewScheduled(): void {
    this.router.navigate(['/social/scheduled']);
  }

  viewPublished(): void {
    this.router.navigate(['/social/published']);
  }
}
