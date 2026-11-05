
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from './api.config';

export type CustomerType = string;
export type CustomerSource = string;

export type CustomerSort =
  | 'newest'
  | 'oldest'
  | 'name_asc'
  | 'name_desc';

export interface CustomerItem {
  id: string;
  accountId: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  gstin: string;
  customerType: CustomerType;
  source: CustomerSource;
  image: string;
  createdAt: string;
  updatedAt?: string;
  lastContactAt?: string | null;
}

export interface CustomerCounts {
  total: number;
  byType: Record<string, number>;
}

export interface CustomerOptions {
  customerTypes: string[];
  customerSources: string[];
}

export interface CustomerListResponse {
  items: CustomerItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  counts: CustomerCounts;
}

export interface CustomerListQuery {
  accountId: string | number;
  page: number;
  limit: number;
  search?: string;
  type?: CustomerType | '';
  source?: CustomerSource | '';
  sort?: CustomerSort;
}

export interface CreateCustomerPayload {
  accountId: string | number;
  name?: string;
  mobile?: string;
  email?: string;
  address?: string;
  gstin?: string;
  customerType?: CustomerType;
  source?: CustomerSource;
  image?: string;
}

export interface UpdateCustomerPayload {
  accountId?: string | number;
  name?: string;
  mobile?: string;
  email?: string;
  address?: string;
  gstin?: string;
  customerType?: CustomerType;
  source?: CustomerSource;
  image?: string;
}

export interface CustomerMobileLookupResponse {
  item: CustomerItem | null;
}

export interface InvoiceCustomerSyncPayload {
  name: string;
  mobile: string;
  email?: string;
  address?: string;
  updateExisting: boolean;
}

export interface InvoiceCustomerSyncResponse {
  item: CustomerItem;
  created: boolean;
  updated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerApiService {

  private readonly endpoint = `${API_BASE_URL}/customers`;

  constructor(
    private readonly http: HttpClient
  ) {}

  options(): Observable<CustomerOptions> {
    return this.http.get<CustomerOptions>(
      `${this.endpoint}/options`
    );
  }

  list(
    query: CustomerListQuery
  ): Observable<CustomerListResponse> {
    let params = new HttpParams()
      .set('accountId', String(query.accountId))
      .set('page', String(query.page))
      .set('limit', String(query.limit))
      .set('sort', query.sort || 'newest');

    const search = String(query.search || '').trim();

    if (search) {
      params = params.set('search', search);
    }

    if (query.type) {
      params = params.set('type', query.type);
    }

    if (query.source) {
      params = params.set('source', query.source);
    }

    return this.http.get<CustomerListResponse>(
      this.endpoint,
      { params }
    );
  }

  findByMobile(
    mobile: string
  ): Observable<CustomerMobileLookupResponse> {
    const normalizedMobile = this.normalizeMobile(mobile);

    return this.http.get<CustomerMobileLookupResponse>(
      `${this.endpoint}/by-mobile/${encodeURIComponent(normalizedMobile)}`
    );
  }

  syncFromInvoice(
    payload: InvoiceCustomerSyncPayload
  ): Observable<InvoiceCustomerSyncResponse> {
    const normalizedMobile = this.normalizeMobile(payload.mobile);

    return this.http.post<InvoiceCustomerSyncResponse>(
      `${this.endpoint}/from-invoice`,
      {
        name: String(payload.name || '').trim(),
        mobile: normalizedMobile,
        email: String(payload.email || '').trim(),
        address: String(payload.address || '').trim(),
        updateExisting: payload.updateExisting
      }
    );
  }

  create(
    payload: CreateCustomerPayload
  ): Observable<CustomerItem> {
    return this.http.post<CustomerItem>(
      this.endpoint,
      payload
    );
  }

  update(
    id: string,
    payload: UpdateCustomerPayload
  ): Observable<CustomerItem> {
    return this.http.patch<CustomerItem>(
      `${this.endpoint}/${encodeURIComponent(id)}`,
      payload
    );
  }

  delete(
    id: string
  ): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.endpoint}/${encodeURIComponent(id)}`
    );
  }

  importExcelRows(
    accountId: string | number,
    rows: Array<Partial<CustomerItem>>
  ): Observable<{ imported: number }> {
    return this.http.post<{ imported: number }>(
      `${this.endpoint}/import/excel`,
      {
        accountId,
        rows
      }
    );
  }

  importAiRows(
    accountId: string | number,
    rows: Array<Partial<CustomerItem>>
  ): Observable<{ imported: number }> {
    return this.http.post<{ imported: number }>(
      `${this.endpoint}/import/ai`,
      {
        accountId,
        rows
      }
    );
  }

  private normalizeMobile(value: string): string {
    let mobile = String(value || '').replace(/\D/g, '');

    if (mobile.startsWith('0091')) {
      mobile = mobile.slice(4);
    } else if (mobile.startsWith('91') && mobile.length === 12) {
      mobile = mobile.slice(2);
    } else if (mobile.startsWith('0') && mobile.length === 11) {
      mobile = mobile.slice(1);
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      throw new Error('Please enter a valid 10-digit Indian mobile number.');
    }

    return mobile;
  }
}
