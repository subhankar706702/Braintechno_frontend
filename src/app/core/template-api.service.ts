import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { AdminSummary, Campaign, TemplateDraft } from './models';

@Injectable({ providedIn: 'root' })
export class TemplateApiService {
  constructor(private http: HttpClient) {}
  listTemplates(): Observable<TemplateDraft[]> { return this.http.get<TemplateDraft[]>(`${API_BASE_URL}/templates`); }
  createTemplate(body: Partial<TemplateDraft>): Observable<TemplateDraft> { return this.http.post<TemplateDraft>(`${API_BASE_URL}/templates`, body); }
  updateTemplate(id: string, body: Partial<TemplateDraft>): Observable<TemplateDraft> { return this.http.put<TemplateDraft>(`${API_BASE_URL}/templates/${encodeURIComponent(id)}`, body); }
  listCampaigns(): Observable<Campaign[]> { return this.http.get<Campaign[]>(`${API_BASE_URL}/campaigns`); }
  createCampaign(body: Campaign): Observable<Campaign> { return this.http.post<Campaign>(`${API_BASE_URL}/campaigns`, body); }
  getPublicCampaign(slug: string): Observable<Campaign> { return this.http.get<Campaign>(`${API_BASE_URL}/campaigns/public/${encodeURIComponent(slug)}`); }
  adminSummary(): Observable<AdminSummary> { return this.http.get<AdminSummary>(`${API_BASE_URL}/admin/summary`); }
  adminList<T>(resource: 'businesses' | 'templates' | 'campaigns' | 'users'): Observable<T[]> { return this.http.get<T[]>(`${API_BASE_URL}/admin/${resource}`); }
}
