import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';

export type BroadcastStatus =
  | 'Draft'
  | 'Scheduled'
  | 'Sending'
  | 'Sent'
  | 'Partially Sent'
  | 'Failed'
  | 'Cancelled';

export type BroadcastChannel = 'WhatsApp' | 'SMS' | 'Email';
export type BroadcastSendMode = 'now' | 'schedule';
export type BroadcastCustomerType =
  | 'All'
  | 'New'
  | 'Regular'
  | 'VIP'
  | 'Interested'
  | 'Followup'
  | 'Converted';

export interface BroadcastAudience {
  customerType: BroadcastCustomerType;
  sources: string[];
  city: string;
  lastContact: string;
}

export interface BroadcastItem {
  id: string;
  name: string;
  message: string;
  campaignId: string;
  campaignName: string;
  campaignSlug: string;
  audience: BroadcastAudience;
  matchedAudienceCount: number;
  recipientCount: number;
  excludedRecipientCount: number;
  channelRecipientCounts: Record<BroadcastChannel, number>;
  channels: BroadcastChannel[];
  sendMode: BroadcastSendMode;
  scheduledAt: string | null;
  status: BroadcastStatus;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BroadcastSummary {
  total: number;
  scheduled: number;
  sent: number;
  drafts: number;
}

export interface BroadcastListResponse {
  items: BroadcastItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface BroadcastAudienceCountResponse {
  count: number;
  matchedCount: number;
  recipientCount: number;
  excludedCount: number;
  byChannel: Record<string, number>;
}

export interface BroadcastCampaignOption {
  id: string;
  name: string;
  pageSlug: string;
  businessSlug: string;
  status?: string;
  url?: string;
}

export interface BroadcastOptionsResponse {
  campaigns: BroadcastCampaignOption[];
  sources: string[];
}

export interface BroadcastWalletResponse {
  WhatsApp: number;
  SMS: number;
  Email: number;
}

export interface CreateBroadcastPayload {
  name: string;
  message: string;
  campaignId?: string;
  audience: BroadcastAudience;
  channels: BroadcastChannel[];
  sendMode: BroadcastSendMode;
  scheduledAt?: string | null;
}

@Injectable({ providedIn: 'root' })
export class BroadcastApiService {
  constructor(private readonly http: HttpClient) {}

  summary(): Observable<BroadcastSummary> {
    return this.http.get<BroadcastSummary>(`${API_BASE_URL}/broadcasts/summary`);
  }

  list(search = '', page = 1, limit = 20): Observable<BroadcastListResponse> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<BroadcastListResponse>(`${API_BASE_URL}/broadcasts`, { params });
  }

  get(id: string): Observable<BroadcastItem> {
    return this.http.get<BroadcastItem>(`${API_BASE_URL}/broadcasts/${id}`);
  }

  options(): Observable<BroadcastOptionsResponse> {
    return this.http.get<BroadcastOptionsResponse>(`${API_BASE_URL}/broadcasts/options`);
  }

  wallet(): Observable<BroadcastWalletResponse> {
    return this.http.get<BroadcastWalletResponse>(`${API_BASE_URL}/broadcasts/wallet`);
  }

  audienceCount(audience: BroadcastAudience, channels: BroadcastChannel[] = ['WhatsApp']): Observable<BroadcastAudienceCountResponse> {
    return this.http.post<BroadcastAudienceCountResponse>(
      `${API_BASE_URL}/broadcasts/audience-count`,
      { audience, channels }
    );
  }

  create(payload: CreateBroadcastPayload): Observable<BroadcastItem> {
    return this.http.post<BroadcastItem>(`${API_BASE_URL}/broadcasts`, payload);
  }

  cancel(id: string): Observable<BroadcastItem> {
    return this.http.patch<BroadcastItem>(`${API_BASE_URL}/broadcasts/${id}/cancel`, {});
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${API_BASE_URL}/broadcasts/${id}`);
  }
}
