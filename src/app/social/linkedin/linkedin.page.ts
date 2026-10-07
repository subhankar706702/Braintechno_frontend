import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface LinkedInPost {
  id: number;
  caption: string;
  date: string;
  status: 'Published' | 'Scheduled';
  image?: string;
}

@Component({
  selector: 'app-linkedin-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './linkedin.page.html',
  styleUrls: ['./linkedin.page.scss']
})
export class LinkedInPage {
  isConnected = false;

  accountName = '';
  profileName = '';

  recentPosts: LinkedInPost[] = [];
  scheduledPosts: LinkedInPost[] = [];

  constructor(private router: Router) {}

  get connectionText(): string {
    return this.isConnected ? 'Connected' : 'Not Connected';
  }

  back(): void {
    this.router.navigate(['/app/social']);
  }

  connectLinkedIn(): void {
    // LinkedIn OAuth and account selection will be connected later.
  }

  disconnectLinkedIn(): void {
    this.isConnected = false;
    this.accountName = '';
    this.profileName = '';
    this.recentPosts = [];
    this.scheduledPosts = [];
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
