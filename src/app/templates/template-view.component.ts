import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TemplateDraft } from '../core/models';
import { TemplateStorageService } from '../core/template-storage.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bt-page">
      @if (loading) {
        <div class="bt-card state">Loading preview...</div>
      } @else if (loadError || !template) {
        <div class="bt-card state">
          <h2>No data found</h2>
          <p>{{ loadError || 'Template not found.' }}</p>
          <a class="bt-btn secondary" routerLink="/app/templates">Back to templates</a>
        </div>
      } @else {
        <div class="bt-page-head">
          <div>
            <h1>{{ template.name }}</h1>
            <p class="bt-muted">Saved JPG preview</p>
          </div>
          <div class="actions">
            <a class="bt-btn secondary" routerLink="/app/templates">Back</a>
            <a class="bt-btn" [routerLink]="['/template', template.id]">Edit</a>
          </div>
        </div>
        <div class="bt-card preview">
          @if (previewUrl) {
            <img [src]="previewUrl" [alt]="template.name">
          } @else {
            <div class="state">No JPG preview yet. Open Edit and Save the template once.</div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .actions{display:flex;gap:10px}
    .preview{padding:18px;text-align:center;overflow:auto}
    .preview img{display:block;max-width:100%;height:auto;margin:0 auto;border-radius:12px}
    .state{padding:40px;text-align:center;color:#667085}
    .state h2{margin:0 0 8px;color:#101828}
    .state p{margin:0 0 18px}
  `]
})
export class TemplateViewComponent {
  template?: TemplateDraft;
  previewUrl = '';
  loading = true;
  loadError = '';

  constructor(
    private route: ActivatedRoute,
    private storage: TemplateStorageService
  ) {
  }

  ngOnInit(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    try {
      const id = this.route.snapshot.paramMap.get('id')?.trim() || '';

      if (!id) {
        this.loadError = 'Template id is missing.';
        return;
      }

      this.template = await this.storage.get(id);

      if (!this.template) {
        this.loadError = 'Template not found.';
        return;
      }

      this.previewUrl = this.storage.previewUrl(this.template);
    } catch (error: any) {
      console.error('Failed to load template preview:', error);
      this.loadError = error?.error?.message || error?.message || 'Could not load the template.';
    } finally {
      this.loading = false;
    }
  }
}
