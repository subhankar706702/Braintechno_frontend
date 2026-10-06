import {
  Injectable,
  inject,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  Observable,
} from 'rxjs';

import {
  API_BASE_URL,
} from '../../core/api.config';

export type SocialPostPlatform =
  | 'Facebook'
  | 'Instagram'
  | 'LinkedIn'
  | 'Google Business Profile';

export type SocialPostStatus =
  | 'Draft'
  | 'Scheduled'
  | 'Publishing'
  | 'Published'
  | 'Failed'
  | 'Cancelled';

export interface SocialPostPayload {
  postTo: SocialPostPlatform[];

  postToAll?: boolean;

  content: {
    caption: string;
    link: string;
    hashtags: string;
    cta: string;
  };

  media?: {
    original?: {
      url?: string;
      name?: string;
    };
  };

  status?: 'Draft' | 'Scheduled';

  scheduledAt?: string | null;
}

export interface SocialPost {
  _id: string;

  userId: string;
  businessId: string;
  accountId?: string;

  postTo: SocialPostPlatform[];

  content: {
    caption: string;
    link: string;
    hashtags: string;
    cta: string;
  };

  media?: {
    original?: {
      url?: string;
      name?: string;
    };
  };

  status: SocialPostStatus;

  scheduledAt?: string | null;

  publishedAt?: string | null;

  platformPosts: Array<{
    platform: SocialPostPlatform;
    providerPostId?: string;
    status?: string;
    publishedAt?: string | null;
    error?: string;
  }>;

  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class SocialPostService {
  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    `${API_BASE_URL}/social/posts`;

  getPosts(
    status?: SocialPostStatus,
  ): Observable<SocialPost[]> {
    const url = status
      ? `${this.baseUrl}?status=${encodeURIComponent(status)}`
      : this.baseUrl;

    return this.http.get<SocialPost[]>(
      url,
    );
  }

  getScheduledPosts():
    Observable<SocialPost[]> {
    return this.http.get<SocialPost[]>(
      `${this.baseUrl}/scheduled`,
    );
  }

  getPublishedPosts():
    Observable<SocialPost[]> {
    return this.http.get<SocialPost[]>(
      `${this.baseUrl}/published`,
    );
  }

  getPost(
    id: string,
  ): Observable<SocialPost> {
    return this.http.get<SocialPost>(
      `${this.baseUrl}/${encodeURIComponent(id)}`,
    );
  }

  createPost(
    payload: SocialPostPayload,
  ): Observable<SocialPost> {
    return this.http.post<SocialPost>(
      this.baseUrl,
      payload,
    );
  }

  updatePost(
    id: string,
    payload: Partial<SocialPostPayload>,
  ): Observable<SocialPost> {
    return this.http.patch<SocialPost>(
      `${this.baseUrl}/${encodeURIComponent(id)}`,
      payload,
    );
  }

  schedulePost(
    id: string,
    scheduledAt: string,
  ): Observable<SocialPost> {
    return this.http.post<SocialPost>(
      `${this.baseUrl}/${encodeURIComponent(id)}/schedule`,
      {
        scheduledAt,
      },
    );
  }

  publishPost(
    id: string,
  ): Observable<SocialPost> {
    return this.http.post<SocialPost>(
      `${this.baseUrl}/${encodeURIComponent(id)}/publish`,
      {},
    );
  }

  cancelPost(
    id: string,
  ): Observable<SocialPost> {
    return this.http.post<SocialPost>(
      `${this.baseUrl}/${encodeURIComponent(id)}/cancel`,
      {},
    );
  }

  deletePost(
    id: string,
  ): Observable<{ message: string }> {
    return this.http.delete<{
      message: string;
    }>(
      `${this.baseUrl}/${encodeURIComponent(id)}`,
    );
  }
}