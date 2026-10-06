import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

type ScheduledStatus = 'Scheduled' | 'Publishing' | 'Cancelled';

interface ScheduledPost {
  id: number;
  platform: string;
  platformClass: string;
  caption: string;
  imageUrl: string;
  scheduledAt: string;
  status: ScheduledStatus;
}

@Component({
  selector: 'app-scheduled',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scheduled.page.html',
  styleUrl: './scheduled.page.scss'
})
export class ScheduledPage {
  scheduledPosts: ScheduledPost[] = [];

  constructor(private router: Router) {}

  createPost(): void {
    this.router.navigate(['/social/create-post']);
  }

  viewPost(post: ScheduledPost): void {
    // Details view will be connected to the backend later.
    console.log('View scheduled post:', post.id);
  }

  editPost(post: ScheduledPost): void {
    // Edit flow will be connected to the backend later.
    console.log('Edit scheduled post:', post.id);
  }

  cancelPost(post: ScheduledPost): void {
    if (post.status === 'Cancelled') {
      return;
    }

    post.status = 'Cancelled';
  }

  get activeScheduledCount(): number {
    return this.scheduledPosts.filter(post => post.status === 'Scheduled').length;
  }

  get publishingCount(): number {
    return this.scheduledPosts.filter(post => post.status === 'Publishing').length;
  }

  get cancelledCount(): number {
    return this.scheduledPosts.filter(post => post.status === 'Cancelled').length;
  }
}
