import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TemplateDraft, CampaignContext, Campaign, CampaignCategory, AdminSummary } from '../core/models';
import { API_BASE_URL } from '../core/api.config';


@Injectable({ providedIn: 'root' })
export class TemplateApiService {
  constructor(private http: HttpClient) {}

  listTemplates(): Observable<TemplateDraft[]> {
    return this.http.get<TemplateDraft[]>(`${API_BASE_URL}/templates`);
  }

  createTemplate(body: Partial<TemplateDraft>): Observable<TemplateDraft> {
    return this.http.post<TemplateDraft>(`${API_BASE_URL}/templates`, body);
  }

  updateTemplate(id: string, body: Partial<TemplateDraft>): Observable<TemplateDraft> {
    return this.http.put<TemplateDraft>(`${API_BASE_URL}/templates/${encodeURIComponent(id)}`, body);
  }

  getCampaignContext(): Observable<CampaignContext> {
    return this.http.get<CampaignContext>(`${API_BASE_URL}/campaigns/context`);
  }

  listCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${API_BASE_URL}/campaigns`);
  }

  getCampaign(id: string): Observable<Campaign> {
    return this.http.get<Campaign>(`${API_BASE_URL}/campaigns/${encodeURIComponent(id)}`);
  }

  createCampaign(body: {
    name?: string;
    pageSlug: string;
    category: CampaignCategory;
    templateId: string;
    useBlankTemplate?: boolean;
    description?: string;
    endAt?: string | null;
  }): Observable<Campaign> {
    return this.http.post<Campaign>(`${API_BASE_URL}/campaigns`, body);
  }

  updateCampaign(
    id: string,
    body: Partial<Pick<Campaign, 'name' | 'category' | 'description' | 'html' | 'design' | 'endAt'>>
  ): Observable<Campaign> {
    return this.http.put<Campaign>(`${API_BASE_URL}/campaigns/${encodeURIComponent(id)}`, body);
  }

  publishCampaign(id: string, endAt?: string | null): Observable<Campaign> {
    return this.http.post<Campaign>(`${API_BASE_URL}/campaigns/${encodeURIComponent(id)}/publish`, {
      endAt: endAt || null
    });
  }

  scheduleCampaign(id: string, publishAt: string, endAt?: string | null): Observable<Campaign> {
    return this.http.post<Campaign>(`${API_BASE_URL}/campaigns/${encodeURIComponent(id)}/schedule`, {
      publishAt,
      endAt: endAt || null
    });
  }

  unpublishCampaign(id: string): Observable<Campaign> {
    return this.http.post<Campaign>(`${API_BASE_URL}/campaigns/${encodeURIComponent(id)}/unpublish`, {});
  }

  reuseCampaign(id: string): Observable<Campaign> {
    return this.http.post<Campaign>(`${API_BASE_URL}/campaigns/${encodeURIComponent(id)}/reuse`, {});
  }

  deleteCampaign(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/campaigns/${encodeURIComponent(id)}`);
  }

  getPublicCampaign(businessSlug: string, pageSlug: string): Observable<Campaign> {
    return this.http.get<Campaign>(`${API_BASE_URL}/campaigns/public/${encodeURIComponent(businessSlug)}/${encodeURIComponent(pageSlug)}`);
  }

  adminSummary(): Observable<AdminSummary> {
    return this.http.get<AdminSummary>(`${API_BASE_URL}/admin/summary`);
  }

  adminList<T>(resource: 'businesses' | 'templates' | 'campaigns' | 'users'): Observable<T[]> {
    return this.http.get<T[]>(`${API_BASE_URL}/admin/${resource}`);
  }
}
