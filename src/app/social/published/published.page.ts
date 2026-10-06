import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

type PublishedStatus = 'Published' | 'Failed';

interface PublishedPost {
  id: number;
  platform: string;
  platformClass: string;
  caption: string;
  imageUrl: string;
  publishedAt: string;
  status: PublishedStatus;
  providerPostId: string;
}

@Component({
  selector: 'app-published',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './published.page.html',
  styleUrl: './published.page.scss'
})
export class PublishedPage {
  publishedPosts: PublishedPost[] = [];

  constructor(private router: Router) {}

  createPost(): void {
    this.router.navigate(['/social/create-post']);
  }

  viewDetails(post: PublishedPost): void {
    // Platform/provider details will be connected to the backend later.
    console.log('View published post:', post.id);
  }

  get publishedCount(): number {
    return this.publishedPosts.filter(post => post.status === 'Published').length;
  }

  get failedCount(): number {
    return this.publishedPosts.filter(post => post.status === 'Failed').length;
  }

  get platformCount(): number {
    return new Set(this.publishedPosts.map(post => post.platform)).size;
  }
}
