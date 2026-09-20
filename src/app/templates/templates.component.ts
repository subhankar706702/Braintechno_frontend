import {
  ChangeDetectorRef,
  Component
} from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../core/auth.service';
import { TemplateDraft } from '../core/models';
import { TemplateStorageService } from '../core/template-storage.service';
import { IndiaDatePipe } from '../shared/india-date.pipe';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [
    IndiaDatePipe
  ],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent {

  items: TemplateDraft[] = [];

  loading = false;

  loadError = '';

  constructor(
    public auth: AuthService,
    private storage: TemplateStorageService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    void this.refresh();
  }

  get accountId(): string {
    return String(
      this.auth.user()?.accountId ?? ''
    );
  }

  previewUrl(
    item: TemplateDraft
  ): string {
    return this.storage.previewUrl(item);
  }

  async refresh(): Promise<void> {

    const accountId = this.accountId;

    if (!accountId) {

      this.items = [];
      this.loading = false;

      this.loadError =
        'Account ID is missing. Please login again.';

      this.cdr.detectChanges();

      return;
    }

    try {

      this.loading = true;
      this.loadError = '';

      this.cdr.detectChanges();

      const result =
        await this.storage.list(
          accountId
        );

      this.items =
        Array.isArray(result)
          ? result
          : [];

    } catch (error) {

      console.error(
        'Failed to load templates:',
        error
      );

      this.items = [];

      this.loadError =
        'Could not load templates.';

    } finally {

      this.loading = false;

      this.cdr.detectChanges();

    }
  }

  async create(): Promise<void> {

    try {

      this.loading = true;
      this.loadError = '';

      this.cdr.detectChanges();

      const item =
        await this.storage.create();

      await this.router.navigate([
        '/template',
        item.id
      ]);

    } catch (error) {

      console.error(
        'Failed to create template:',
        error
      );

      this.loadError =
        'Could not create the template.';

    } finally {

      this.loading = false;

      this.cdr.detectChanges();

    }
  }

  async edit(
    item: TemplateDraft
  ): Promise<void> {

    await this.router.navigate([
      '/template',
      item.id
    ]);

  }

  async view(
    item: TemplateDraft
  ): Promise<void> {

    await this.router.navigate([
      '/template',
      item.id,
      'view'
    ]);

  }

  async duplicate(
    item: TemplateDraft
  ): Promise<void> {

    try {

      this.loading = true;
      this.loadError = '';

      this.cdr.detectChanges();

      const copy =
        await this.storage.create(
          `${item.name} Copy`
        );

      await this.storage.save({
        ...copy,

        description:
          item.description,

        design:
          structuredClone(
            item.design
          ),

        html:
          item.html
      });

      await this.refresh();

    } catch (error) {

      console.error(
        'Failed to duplicate template:',
        error
      );

      this.loadError =
        'Could not duplicate the template.';

    } finally {

      this.loading = false;

      this.cdr.detectChanges();

    }
  }

  async remove(
    item: TemplateDraft
  ): Promise<void> {

    if (
      !confirm(
        `Delete "${item.name}"?`
      )
    ) {
      return;
    }

    try {

      this.loading = true;
      this.loadError = '';

      this.cdr.detectChanges();

      await this.storage.delete(
        item.id
      );

      await this.refresh();

    } catch (error) {

      console.error(
        'Failed to delete template:',
        error
      );

      this.loadError =
        'Could not delete the template.';

    } finally {

      this.loading = false;

      this.cdr.detectChanges();

    }
  }
}