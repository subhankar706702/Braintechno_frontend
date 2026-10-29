
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

/**
 * SKU backend automatically generate করবে।
 * তাই frontend থেকে SKU পাঠানো বা edit করার প্রয়োজন নেই।
 */
export interface StockPayload {
  name: string;
  description?: string;
  imageUrl?: string;
  originalPrice: number;
  discountPrice: number;
  gstEnabled: boolean;
  gstRate: number;
  quantity: number;
  unit: string;
}

export interface BusinessHubSettings {
  accountId?: string;
  skuPrefix: string;
  nextSkuNumber: number;
  skuNumberPadding: number;
  defaultLowStockThreshold: number;
  hasStockItems?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateBusinessHubSettingsPayload {
  skuPrefix: string;
  startingNumber?: number;
  skuNumberPadding: number;
  defaultLowStockThreshold: number;
}

@Injectable({
  providedIn: 'root'
})
export class MyStockApiService {
  private readonly stockEndpoint =
    `${API_BASE_URL}/business-hub/stock`;

  private readonly settingsEndpoint =
    `${API_BASE_URL}/business-hub/settings`;

  constructor(
    private readonly http: HttpClient
  ) {}

  // Get stock products
  list(
    search = '',
    status = 'all'
  ): Observable<{
    items: StockItem[];
    total: number;
  }> {
    let params = new HttpParams()
      .set('status', status);

    if (search.trim()) {
      params = params.set(
        'search',
        search.trim()
      );
    }

    return this.http.get<{
      items: StockItem[];
      total: number;
    }>(
      this.stockEndpoint,
      { params }
    );
  }

  // Create product
  create(
    payload: StockPayload
  ): Observable<StockItem> {
    return this.http.post<StockItem>(
      this.stockEndpoint,
      payload
    );
  }

  // Update product
  update(
    id: string,
    payload: StockPayload
  ): Observable<StockItem> {
    return this.http.patch<StockItem>(
      `${this.stockEndpoint}/${encodeURIComponent(id)}`,
      payload
    );
  }

  // Delete product
  delete(
    id: string
  ): Observable<{
    success: boolean;
    id: string;
  }> {
    return this.http.delete<{
      success: boolean;
      id: string;
    }>(
      `${this.stockEndpoint}/${encodeURIComponent(id)}`
    );
  }

  // Get Business Hub settings
  getSettings(): Observable<BusinessHubSettings> {
    return this.http.get<BusinessHubSettings>(
      this.settingsEndpoint
    );
  }

  // Update Business Hub settings
  updateSettings(
    payload: UpdateBusinessHubSettingsPayload
  ): Observable<BusinessHubSettings> {
    return this.http.patch<BusinessHubSettings>(
      this.settingsEndpoint,
      payload
    );
  }
}
