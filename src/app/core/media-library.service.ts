import {
  Injectable,
  computed,
} from '@angular/core';

import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';

import {
  Observable,
} from 'rxjs';

import {
  API_BASE_URL,
} from './api.config';

import {
  AuthService,
} from './auth.service';

export type MediaLibraryKind =
  | 'customer'
  | 'template_preview';

export type MediaLibraryType =
  | 'image'
  | 'video'
  | 'document';

export interface MediaLibraryItem {
  id: string | number;
  accountId: string | number;
  uploadedByUserId?: string | number | null;
  kind: MediaLibraryKind;
  mediaType: MediaLibraryType;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  storageKey: string;
  url: string;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface MediaLibraryListResponse {
  items: MediaLibraryItem[];
  total: number;
  page: number;
  perPage: number;
}

export interface MediaLibraryQuery {
  kind?: MediaLibraryKind;
  mediaType?: MediaLibraryType;
  search?: string;
  page?: number;
  perPage?: number;
}

export interface MediaUploadResponse {
  message?: string;
  item: MediaLibraryItem;
}

@Injectable({
  providedIn: 'root',
})
export class MediaLibraryService {

  private readonly mediaUrl =
    `${API_BASE_URL}/media`;

  readonly accountId = computed(
    () => this.auth.user()?.accountId ?? null,
  );

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService,
  ) {}

  list(
    query: MediaLibraryQuery = {},
  ): Observable<MediaLibraryListResponse> {

    let params = new HttpParams()
      .set(
        'kind',
        query.kind ?? 'customer',
      )
      .set(
        'mediaType',
        query.mediaType ?? 'image',
      )
      .set(
        'page',
        String(query.page ?? 1),
      )
      .set(
        'perPage',
        String(query.perPage ?? 60),
      );

    const search = String(
      query.search ?? '',
    ).trim();

    if (search) {
      params = params.set(
        'search',
        search,
      );
    }

    return this.http.get<MediaLibraryListResponse>(
      this.mediaUrl,
      { params },
    );
  }

  uploadCustomerImage(
    file: File,
  ): Observable<MediaUploadResponse> {

    const formData = new FormData();

    formData.append(
      'file',
      file,
      file.name,
    );

    formData.append(
      'kind',
      'customer',
    );

    formData.append(
      'mediaType',
      'image',
    );

    return this.http.post<MediaUploadResponse>(
      `${this.mediaUrl}/upload`,
      formData,
    );
  }

  remove(
    mediaId: string | number,
  ): Observable<{ message?: string }> {
    return this.http.delete<{ message?: string }>(
      `${this.mediaUrl}/${encodeURIComponent(String(mediaId))}`,
    );
  }
}
