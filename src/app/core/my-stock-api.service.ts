
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';

export type StockStatus =
  | 'in-stock'
  | 'low-stock'
  | 'out-of-stock';

export interface StockItem {
  id: string;
  name: string;
  description: string;
  sku: string;
  imageUrl: string;
  originalPrice: number;
  discountPrice: number;
  gstEnabled: boolean;
  gstRate: number;
  quantity: number;
  unit: string;
  lowStockThreshold: number | null;
  stockStatus: StockStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockPayload {
  name: string;
  description?: string;
  sku?: string;
  imageUrl?: string;
  originalPrice: number;
  discountPrice: number;
  gstEnabled: boolean;
  gstRate: number;
  quantity: number;
  unit: string;
  lowStockThreshold: number | null;
}

@Injectable({ providedIn: 'root' })
export class MyStockApiService {
  private readonly endpoint =
    `${API_BASE_URL}/business-hub/stock`;

  constructor(private readonly http: HttpClient) {}

  list(
    search = '',
    status = 'all'
  ): Observable<{ items: StockItem[]; total: number }> {
    let params = new HttpParams().set('status', status);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<{ items: StockItem[]; total: number }>(
      this.endpoint,
      { params }
    );
  }

  create(payload: StockPayload): Observable<StockItem> {
    return this.http.post<StockItem>(this.endpoint, payload);
  }

  update(id: string, payload: StockPayload): Observable<StockItem> {
    return this.http.patch<StockItem>(
      `${this.endpoint}/${encodeURIComponent(id)}`,
      payload
    );
  }

  delete(id: string): Observable<{ success: boolean; id: string }> {
    return this.http.delete<{ success: boolean; id: string }>(
      `${this.endpoint}/${encodeURIComponent(id)}`
    );
  }
}
