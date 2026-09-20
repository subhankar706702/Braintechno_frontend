import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_BASE_URL } from './api.config';
import { TemplateDraft } from './models';

@Injectable({ providedIn: 'root' })
export class TemplateStorageService {
  private readonly api = `${API_BASE_URL}/templates`;
  private readonly serverOrigin = API_BASE_URL.replace(/\/api\/?$/, '');

  constructor(private http: HttpClient) {}

  async list(accountId: string | number): Promise<TemplateDraft[]> {
    const params = new HttpParams().set('accountId', String(accountId));

    const response = await firstValueFrom(
      this.http.get<unknown>(this.api, { params })
    );

    const rows = Array.isArray(response)
      ? response
      : this.extractArray(response);

    return rows.map((row) => this.normalize(row));
  }

  async get(id: string): Promise<TemplateDraft | undefined> {
    if (!id.trim()) {
      return undefined;
    }

    const response = await firstValueFrom(
      this.http.get<unknown>(`${this.api}/${encodeURIComponent(id)}`)
    );

    const value = this.extractObject(response);

    if (!value || typeof value !== 'object') {
      return undefined;
    }

    return this.normalize(value);
  }

  async create(name = 'Untitled Template'): Promise<TemplateDraft> {
    const response = await firstValueFrom(
      this.http.post<unknown>(this.api, {
        name,
        description: '',
        design: this.emptyDesign(),
        html: '',
        status: 'draft'
      })
    );

    return this.normalize(this.extractObject(response));
  }

  async save(
    item: TemplateDraft,
    previewJpg?: string
  ): Promise<TemplateDraft> {
    if (!item.id) {
      throw new Error('Template id is missing.');
    }

    const response = await firstValueFrom(
      this.http.put<unknown>(
        `${this.api}/${encodeURIComponent(item.id)}`,
        {
          name: item.name,
          description: item.description,
          design: item.design,
          html: item.html,
          status: item.status,
          previewJpg
        }
      )
    );

    return this.normalize(this.extractObject(response));
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.api}/${encodeURIComponent(id)}`)
    );
  }

  previewUrl(item: TemplateDraft): string {
    const value = String(item.previewImage || '').trim();

    if (!value) {
      return '';
    }

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    return `${this.serverOrigin}${value.startsWith('/') ? '' : '/'}${value}`;
  }

  private normalize(value: any): TemplateDraft {
    const id = String(value?.id || value?._id || '');

    if (!id) {
      throw new Error('Template response does not contain an id.');
    }

    const design =
      Array.isArray(value?.design) && value.design.length === 1
        ? value.design[0]
        : value?.design;

    return {
      ...value,
      id,
      _id: value?._id ? String(value._id) : id,
      accountId: value?.accountId,
      name: String(
        value?.name ||
        value?.templateName ||
        value?.title ||
        'Untitled Template'
      ),
      description: String(value?.description || ''),
      design:
        design && typeof design === 'object'
          ? design
          : this.emptyDesign(),
      html: String(value?.html || ''),
      previewImage: String(value?.previewImage || ''),
      previewImageName: String(value?.previewImageName || ''),
      status: ['draft', 'published', 'locked'].includes(value?.status)
        ? value.status
        : 'draft',
      createdAt: String(value?.createdAt || ''),
      updatedAt: String(value?.updatedAt || value?.createdAt || '')
    };
  }

  private extractArray(value: any): any[] {
    const rows = value?.data ?? value?.templates ?? value?.value ?? [];
    return Array.isArray(rows) ? rows : [];
  }

  private extractObject(value: any): any {
    return value?.data ?? value?.template ?? value;
  }

  private emptyDesign(): unknown {
    return {
      counters: {},
      body: {
        rows: [],
        values: {
          backgroundColor: '#ffffff',
          contentWidth: '600px',
          fontFamily: {
            label: 'Arial',
            value: 'arial,helvetica,sans-serif'
          }
        }
      },
      schemaVersion: 21
    };
  }
}
