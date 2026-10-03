import {
  Injectable
} from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  API_BASE_URL
} from './api.config';


/**
 * Customer type/source values are runtime values owned by the backend.
 * Do not convert these into a frontend enum or literal union.
 */
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
  customerType?: CustomerType;
  source?: CustomerSource;
  image?: string;
}

export interface UpdateCustomerPayload {
  accountId?: string | number;
  name?: string;
  mobile?: string;
  email?: string;
  customerType?: CustomerType;
  source?: CustomerSource;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerApiService {

  constructor(
    private readonly http:
      HttpClient
  ) { }


  options(): Observable<CustomerOptions> {
    return this.http.get<CustomerOptions>(
      `${API_BASE_URL}/customers/options`
    );
  }


  list(
    query: CustomerListQuery
  ): Observable<CustomerListResponse> {

    let params =
      new HttpParams()
        .set(
          'accountId',
          String(query.accountId)
        )
        .set(
          'page',
          String(query.page)
        )
        .set(
          'limit',
          String(query.limit)
        )
        .set(
          'sort',
          query.sort || 'newest'
        );

    const search =
      String(
        query.search || ''
      ).trim();

    if (search) {
      params = params.set(
        'search',
        search
      );
    }

    if (query.type) {
      params = params.set(
        'type',
        query.type
      );
    }

    if (query.source) {
      params = params.set(
        'source',
        query.source
      );
    }

    return this.http.get<CustomerListResponse>(
      `${API_BASE_URL}/customers`,
      { params }
    );
  }


  create(
    payload: CreateCustomerPayload
  ): Observable<CustomerItem> {
    return this.http.post<CustomerItem>(
      `${API_BASE_URL}/customers`,
      payload
    );
  }


  update(
    id: string,
    payload: UpdateCustomerPayload
  ): Observable<CustomerItem> {
    return this.http.patch<CustomerItem>(
      `${API_BASE_URL}/customers/${id}`,
      payload
    );
  }


  delete(
    id: string
  ): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${API_BASE_URL}/customers/${id}`
    );
  }


  importExcelRows(
    accountId: string | number,
    rows: Array<Partial<CustomerItem>>
  ): Observable<{ imported: number }> {
    return this.http.post<{ imported: number }>(
      `${API_BASE_URL}/customers/import/excel`,
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
      `${API_BASE_URL}/customers/import/ai`,
      {
        accountId,
        rows
      }
    );
  }
}
