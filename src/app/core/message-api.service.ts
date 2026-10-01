import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';

export type MessageTab = 'all' | 'unread' | 'read';
export type MessageQueryStatus = 'New' | 'In Progress' | 'Resolved';

export interface MessageSummary {
  total: number;
  unread: number;
  read: number;
}

export interface MessageItem {
  id: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  message: string;
  source: 'Campaign';
  campaignId: string;
  campaignName: string;
  campaignSlug: string;
  readStatus: 'unread' | 'read';
  queryStatus: MessageQueryStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface MessageCustomer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  image: string;
  customerType: string;
  lastContactAt?: string | null;
}

export interface MessageThread {
  customer: MessageCustomer;
  latestMessage: MessageItem;
  unreadCount: number;
  source: 'Campaign';
  campaign: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface MessageListResponse {
  items: MessageThread[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface MessageConversationResponse {
  customer: MessageCustomer | null;
  messages: MessageItem[];
}

export interface PublicMessagePayload {
  name: string;
  mobile: string;
  email?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageApiService {
  constructor(private readonly http: HttpClient) {}

  summary(): Observable<MessageSummary> {
    return this.http.get<MessageSummary>(`${API_BASE_URL}/messages/summary`);
  }

  list(
    tab: MessageTab = 'all',
    search = '',
    page = 1,
    limit = 20
  ): Observable<MessageListResponse> {
    let params = new HttpParams()
      .set('tab', tab)
      .set('page', String(page))
      .set('limit', String(limit));

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<MessageListResponse>(
      `${API_BASE_URL}/messages`,
      { params }
    );
  }

  conversation(customerId: string): Observable<MessageConversationResponse> {
    return this.http.get<MessageConversationResponse>(
      `${API_BASE_URL}/messages/customer/${customerId}`
    );
  }

  markMessageRead(id: string): Observable<MessageItem> {
    return this.http.patch<MessageItem>(
      `${API_BASE_URL}/messages/${id}/read`,
      {}
    );
  }

  markConversationRead(customerId: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${API_BASE_URL}/messages/customer/${customerId}/read`,
      {}
    );
  }

  updateStatus(
    id: string,
    queryStatus: MessageQueryStatus
  ): Observable<MessageItem> {
    return this.http.patch<MessageItem>(
      `${API_BASE_URL}/messages/${id}/status`,
      { queryStatus }
    );
  }

  submitPublicMessage(
    businessSlug: string,
    pageSlug: string,
    payload: PublicMessagePayload
  ): Observable<{ message: string; item: MessageItem }> {
    return this.http.post<{ message: string; item: MessageItem }>(
      `${API_BASE_URL}/messages/public/${encodeURIComponent(businessSlug)}/${encodeURIComponent(pageSlug)}`,
      payload
    );
  }
}
