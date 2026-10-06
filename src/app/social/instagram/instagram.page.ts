import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface InstagramPost {
  id: number;
  caption: string;
  date: string;
  status: 'Published' | 'Scheduled';
  image?: string;
}

@Component({
  selector: 'app-instagram-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instagram.page.html',
  styleUrls: ['./instagram.page.scss']
})
export class InstagramPage {
  isConnected = false;

  accountName = '';
  username = '';

  recentPosts: InstagramPost[] = [];
  scheduledPosts: InstagramPost[] = [];

  constructor(private router: Router) {}

  get connectionText(): string {
    return this.isConnected ? 'Connected' : 'Not Connected';
  }

  connectInstagram(): void {
    // OAuth connection will be handled by the backend service.
    // Keeping this method safe until OAuth is connected.
  }

  disconnectInstagram(): void {
    this.isConnected = false;
    this.accountName = '';
    this.username = '';
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
