import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/api.config';
import { FinalizedInvoiceResponse, InvoiceDraftPayload, InvoicePreviewResponse } from './invoice.model';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class InvoiceApiService {
  private readonly endpoint = `${API_BASE_URL}/business-hub/invoices`;
  constructor(private readonly http: HttpClient) {}
  preview(payload: InvoiceDraftPayload): Observable<InvoicePreviewResponse> { return this.http.post<InvoicePreviewResponse>(`${this.endpoint}/preview`, payload); }
  finalize(payload: InvoiceDraftPayload): Observable<FinalizedInvoiceResponse> { return this.http.post<FinalizedInvoiceResponse>(`${this.endpoint}/finalize`, payload); }
}
