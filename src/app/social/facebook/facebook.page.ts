import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface FacebookPost {
  id: number;
  caption: string;
  date: string;
  status: 'Published' | 'Scheduled';
  image?: string;
}

@Component({
  selector: 'app-facebook-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './facebook.page.html',
  styleUrls: ['./facebook.page.scss']
})
export class FacebookPage {
  isConnected = false;

  pageName = '';
  pageUsername = '';

  recentPosts: FacebookPost[] = [];
  scheduledPosts: FacebookPost[] = [];

  constructor(private router: Router) {}

  get connectionText(): string {
    return this.isConnected ? 'Connected' : 'Not Connected';
  }

  connectFacebook(): void {
    // Facebook OAuth and Page selection will be connected later.
  }

  disconnectFacebook(): void {
    this.isConnected = false;
    this.pageName = '';
    this.pageUsername = '';
    this.recentPosts = [];
    this.scheduledPosts = [];
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
