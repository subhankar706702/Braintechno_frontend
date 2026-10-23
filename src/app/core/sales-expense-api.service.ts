import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';

export type BusinessTransactionType = 'sale' | 'expense';
export type BusinessTransactionPeriod = 'day' | 'week' | 'month';

export interface BusinessTransaction {
  id: string;
  type: BusinessTransactionType;
  entryDate: string;
  category: string;
  amount: number;
  paymentMethod: string;
  note: string;
  createdAt: string;
}

export interface BusinessTransactionListResponse {
  items: BusinessTransaction[];
  summary: { sales: number; expenses: number; net: number; count: number };
  period: BusinessTransactionPeriod;
}

export interface CreateBusinessTransactionPayload {
  type: BusinessTransactionType;
  entryDate: string;
  category: string;
  amount: number;
  paymentMethod?: string;
  note?: string;
}

@Injectable({ providedIn: 'root' })
export class SalesExpenseApiService {
  private readonly endpoint = `${API_BASE_URL}/business-hub/transactions`;

  constructor(private readonly http: HttpClient) {}

  list(period: BusinessTransactionPeriod): Observable<BusinessTransactionListResponse> {
    const params = new HttpParams().set('period', period);
    return this.http.get<BusinessTransactionListResponse>(this.endpoint, { params });
  }

  create(payload: CreateBusinessTransactionPayload): Observable<BusinessTransaction> {
    return this.http.post<BusinessTransaction>(this.endpoint, payload);
  }
}
