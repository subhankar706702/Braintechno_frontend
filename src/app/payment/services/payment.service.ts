import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/api.config';
import { PaymentRecord, PaymentRequest } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);

  createPayment(request: PaymentRequest): Observable<PaymentRecord> {
    return this.http.post<PaymentRecord>(`${API_BASE_URL}/payment/create`, request);
  }

  listPayments(): Observable<PaymentRecord[]> {
    return this.http.get<PaymentRecord[]>(`${API_BASE_URL}/payment`);
  }

  listAdminPayments(status?: string): Observable<PaymentRecord[]> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.http.get<PaymentRecord[]>(`${API_BASE_URL}/admin/subscription-payment/payments${query}`);
  }

  getPayment(paymentId: string): Observable<PaymentRecord> {
    return this.http.get<PaymentRecord>(`${API_BASE_URL}/payment/${encodeURIComponent(paymentId)}`);
  }

  cancelPayment(paymentId: string): Observable<PaymentRecord> {
    return this.http.post<PaymentRecord>(`${API_BASE_URL}/payment/${encodeURIComponent(paymentId)}/cancel`, {});
  }

  getPaymentLabel(plan: PaymentRecord['plan'] | PaymentRequest['plan']): string {
    switch (plan) {
      case 'basic': return 'Basic Plan';
      case 'premium': return 'Premium Plan';
      case 'custom': return 'Custom Plan';
      default: return 'Payment';
    }
  }

  getBillingLabel(cycle: PaymentRecord['billingCycle'] | PaymentRequest['billingCycle']): string {
    switch (cycle) {
      case 'monthly': return 'Monthly';
      case 'halfYearly': return 'Half-Yearly';
      case 'yearly': return 'Yearly';
      case 'custom': return 'Custom';
      default: return 'Billing';
    }
  }
}
