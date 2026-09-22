import {
  Component,
  OnInit,
  ViewChild,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { html2canvas } from '../vendor-bridge';
import { jsPDF } from 'jspdf';

import { TemplateDraft } from '../../../core/models';
import { TemplateStorageService } from '../../../core/template-storage.service';

import { HtmlviewerComponent } from '../htmlviewer.component';
import { UnlayerEditorComponent } from '../unlayer-editor.component';

@Component({
  selector: 'app-template-editor',
  standalone: true,

  imports: [
    FormsModule,
    RouterLink,
    UnlayerEditorComponent,
    HtmlviewerComponent
  ],

  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent implements OnInit {

  @ViewChild('editor')
  editor?: UnlayerEditorComponent;

  template: TemplateDraft = {
    id: '',
    name: 'Untitled Template',
    description: '',
    design: {},
    html: '',
    updatedAt: '',
    createdAt: '',
    status: 'draft'
  };

  readonly dirty = signal(false);
  readonly busy = signal(false);
  readonly loading = signal(true);
  readonly loadError = signal('');
  readonly status = signal('Loading template...');

  readonly showPreview = signal(false);
  readonly previewHtml = signal('');

  constructor(
    private route: ActivatedRoute,
    private storage: TemplateStorageService
  ) {}

  ngOnInit(): void {
    void this.loadTemplate();
  }

  /**
   * Load the exact template selected
   * from the Templates page.
   */
  async loadTemplate(): Promise<void> {

    this.loading.set(true);
    this.loadError.set('');
    this.status.set('Loading template...');

    try {

      const id = String(
        this.route.snapshot.paramMap.get('id') || ''
      ).trim();

      console.log(
        '[Template Editor] Route template id:',
        id
      );

      if (!id) {

        this.loadError.set(
          'Template id is missing.'
        );

        this.status.set(
          'Template unavailable'
        );

        return;
      }

      const found =
        await this.storage.get(id);

      console.log(
        '[Template Editor] API template:',
        found
      );

      if (!found) {

        this.loadError.set(
          'No data found for this template.'
        );

        this.status.set(
          'Template not found'
        );

        return;
      }

      this.template = {
        ...found,

        design:
          this.isValidDesign(found.design)
            ? found.design
            : this.createEmptyDesign()
      };

      this.dirty.set(false);

      this.status.set(
        'Template loaded'
      );

    } catch (error) {

      console.error(
        '[Template Editor] Template load failed:',
        error
      );

      this.loadError.set(
        this.message(error) ||
        'Could not load the template.'
      );

      this.status.set(
        'Failed to load'
      );

    } finally {

      this.loading.set(false);

    }
  }

  /**
   * Page editor ready.
   */
  onReady(): void {

    console.log(
      '[Template Editor] Page editor ready'
    );

    /*
     * The child component also loads
     * the initial design itself.
     *
     * Calling it here again is safe and
     * ensures MongoDB design is visible.
     */
    if (
      this.editor &&
      this.isValidDesign(
        this.template.design
      )
    ) {

      this.editor.loadDesign(
        this.template.design
      );

    }

    this.status.set(
      this.dirty()
        ? 'Unsaved changes'
        : 'Editor ready'
    );
  }

  /**
   * Editor content changed.
   */
  onChanged(): void {

    this.dirty.set(true);

    this.status.set(
      'Unsaved changes'
    );
  }

  /**
   * Name / description changed.
   */
  markDirty(): void {

    this.dirty.set(true);

    this.status.set(
      'Unsaved changes'
    );
  }

  /**
   * Save template.
   */
  async save(): Promise<void> {

    if (!this.editor) {

      alert(
        'Editor is not ready yet.'
      );

      return;
    }

    if (!this.template.id) {

      alert(
        'Template id is missing.'
      );

      return;
    }

    try {

      this.busy.set(true);

      this.status.set(
        'Saving...'
      );

      const [
        design,
        output
      ] = await Promise.all([
        this.editor.saveDesign(),
        this.editor.exportHtml()
      ]);

      this.template = {
        ...this.template,

        design,

        html:
          output.html,

        updatedAt:
          new Date().toISOString()
      };

      const previewJpg =
        await this.generatePreviewJpg(
          output.html
        );

      const saved =
        await this.storage.save(
          this.template,
          previewJpg
        );

      if (saved) {

        this.template = {
          ...saved
        };

      }

      this.dirty.set(false);

      this.status.set(
        'Saved'
      );

    } catch (error) {

      console.error(
        '[Template Editor] Save failed:',
        error
      );

      this.status.set(
        'Save failed'
      );

      alert(
        'Save failed. ' +
        this.message(error)
      );

    } finally {

      this.busy.set(false);

    }
  }

  /**
   * Import Unlayer JSON.
   *
   * Supports:
   *
   * {
   *   body: {...},
   *   counters: {...}
   * }
   *
   * or:
   *
   * {
   *   design: {
   *     body: {...}
   *   }
   * }
   */
  async importJson(
    event: Event
  ): Promise<void> {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }

    try {

      this.busy.set(true);

      this.status.set(
        'Importing JSON...'
      );

      const text =
        await file.text();

      const parsed =
        JSON.parse(text);

      const design =
        parsed?.design &&
        typeof parsed.design === 'object'
          ? parsed.design
          : parsed;

      if (
        !this.isValidDesign(design)
      ) {

        throw new Error(
          'This file is not a valid Unlayer design JSON.'
        );

      }

      console.log(
        '[Template Editor] Imported JSON:',
        design
      );

      this.template = {
        ...this.template,

        design,

        html: ''
      };

      /*
       * Child will either load immediately
       * or queue it until editor:ready.
       */
      if (this.editor) {

        this.editor.loadDesign(
          design
        );

      }

      this.dirty.set(true);

      this.status.set(
        'JSON imported'
      );

    } catch (error) {

      console.error(
        '[Template Editor] JSON import failed:',
        error
      );

      this.status.set(
        'Import failed'
      );

      alert(
        'Invalid JSON file. Please select a valid BRAIN TECHNO design JSON.'
      );

    } finally {

      this.busy.set(false);

      /*
       * Allows selecting same file again.
       */
      input.value = '';

    }
  }

  /**
   * Start blank design.
   */
  async newDesign(): Promise<void> {

    if (
      this.dirty() &&
      !confirm(
        'Discard current unsaved changes and start a blank design?'
      )
    ) {
      return;
    }

    const design =
      this.createEmptyDesign();

    this.template = {
      ...this.template,

      design,

      html: ''
    };

    if (this.editor) {

      this.editor.loadDesign(
        design
      );

    }

    this.dirty.set(true);

    this.status.set(
      'New blank design'
    );
  }

  /**
   * Get latest HTML.
   */
  async capture(): Promise<string> {

    if (!this.editor) {

      throw new Error(
        'Editor is not ready.'
      );

    }

    const output =
      await this.editor.exportHtml();

    this.template = {
      ...this.template,
      html: output.html
    };

    return output.html;
  }

  /**
   * Preview.
   */
  async preview(): Promise<void> {

    try {

      this.busy.set(true);

      const html =
        await this.capture();

      this.previewHtml.set(
        html
      );

      this.showPreview.set(
        true
      );

    } catch (error) {

      console.error(
        '[Template Editor] Preview failed:',
        error
      );

      alert(
        'Preview failed. ' +
        this.message(error)
      );

    } finally {

      this.busy.set(false);

    }
  }

  closePreview(): void {

    this.showPreview.set(
      false
    );
  }

  /**
   * JSON Download.
   */
  async downloadJson(): Promise<void> {

    try {

      if (!this.editor) {

        throw new Error(
          'Editor is not ready.'
        );

      }

      this.busy.set(true);

      const design =
        await this.editor.saveDesign();

      const blob =
        new Blob(
          [
            JSON.stringify(
              design,
              null,
              2
            )
          ],
          {
            type:
              'application/json;charset=utf-8'
          }
        );

      this.download(
        blob,
        this.safeName() +
        '.json'
      );

    } catch (error) {

      console.error(
        '[Template Editor] JSON export failed:',
        error
      );

      alert(
        'JSON export failed. ' +
        this.message(error)
      );

    } finally {

      this.busy.set(false);

    }
  }

  /**
   * HTML Download.
   */
  async downloadHtml(): Promise<void> {

    try {

      this.busy.set(true);

      const html =
        await this.capture();

      const blob =
        new Blob(
          [html],
          {
            type:
              'text/html;charset=utf-8'
          }
        );

      this.download(
        blob,
        this.safeName() +
        '.html'
      );

    } catch (error) {

      console.error(
        '[Template Editor] HTML export failed:',
        error
      );

      alert(
        'HTML export failed. ' +
        this.message(error)
      );

    } finally {

      this.busy.set(false);

    }
  }

  /**
   * JPG.
   */
  async downloadJpg(): Promise<void> {

    this.busy.set(true);

    let capture:
      {
        target: HTMLElement;
        cleanup: () => void;
      }
      | null = null;

    try {

      const html =
        await this.capture();

      capture =
        await this.renderForCapture(
          html
        );

      const canvas =
        await html2canvas(
          capture.target,
          {
            useCORS: true,
            backgroundColor: '#ffffff',
            scale: 2,
            windowWidth: 1200
          }
        );

      const url =
        canvas.toDataURL(
          'image/jpeg',
          0.94
        );

      this.download(
        this.dataUrlToBlob(url),
        this.safeName() +
        '.jpg'
      );

    } catch (error) {

      console.error(
        '[Template Editor] JPG export failed:',
        error
      );

      alert(
        'JPG export failed. ' +
        this.message(error)
      );

    } finally {

      capture?.cleanup();

      this.busy.set(false);

    }
  }

  /**
   * PDF.
   */
  async downloadPdf(): Promise<void> {

    this.busy.set(true);

    let capture:
      {
        target: HTMLElement;
        cleanup: () => void;
      }
      | null = null;

    try {

      const html =
        await this.capture();

      capture =
        await this.renderForCapture(
          html
        );

      const canvas =
        await html2canvas(
          capture.target,
          {
            useCORS: true,
            backgroundColor: '#ffffff',
            scale: 1.7,
            windowWidth: 1200
          }
        );

      const img =
        canvas.toDataURL(
          'image/jpeg',
          0.92
        );

      const orientation =
        canvas.width >
        canvas.height
          ? 'landscape'
          : 'portrait';

      const pdf =
        new jsPDF({
          orientation,

          unit: 'px',

          format: [
            canvas.width,
            canvas.height
          ]
        });

      pdf.addImage(
        img,
        'JPEG',
        0,
        0,
        canvas.width,
        canvas.height
      );

      pdf.save(
        this.safeName() +
        '.pdf'
      );

    } catch (error) {

      console.error(
        '[Template Editor] PDF export failed:',
        error
      );

      alert(
        'PDF export failed. ' +
        this.message(error)
      );

    } finally {

      capture?.cleanup();

      this.busy.set(false);

    }
  }

  /**
   * Preview image used while saving.
   */
  private async generatePreviewJpg(
    html: string
  ): Promise<string> {

    let capture:
      {
        target: HTMLElement;
        cleanup: () => void;
      }
      | null = null;

    try {

      capture =
        await this.renderForCapture(
          html
        );

      const canvas =
        await html2canvas(
          capture.target,
          {
            useCORS: true,
            backgroundColor:
              '#ffffff',
            scale: 1.35,
            windowWidth: 1200
          }
        );

      return canvas.toDataURL(
        'image/jpeg',
        0.9
      );

    } finally {

      capture?.cleanup();

    }
  }

  /**
   * Isolated render.
   */
  private async renderForCapture(
    html: string
  ): Promise<{
    target: HTMLElement;
    cleanup: () => void;
  }> {

    const box =
      document.createElement(
        'div'
      );

    box.style.cssText = `
      position: fixed;
      left: -12000px;
      top: 0;
      width: 1200px;
      background: #fff;
      z-index: -1;
      overflow: hidden;
    `;

    const iframe =
      document.createElement(
        'iframe'
      );

    iframe.style.cssText = `
      width: 1200px;
      height: 1600px;
      border: 0;
      background: #fff;
      display: block;
    `;

    box.appendChild(
      iframe
    );

    document.body.appendChild(
      box
    );

    const doc =
      iframe.contentDocument;

    if (!doc) {

      box.remove();

      throw new Error(
        'Could not create preview document.'
      );

    }

    doc.open();

    doc.write(
      html
    );

    doc.close();

    await new Promise<void>(
      resolve => {
        setTimeout(
          resolve,
          900
        );
      }
    );

    const height =
      Math.max(
        doc.body?.scrollHeight || 0,

        doc.documentElement
          ?.scrollHeight || 0,

        800
      );

    iframe.style.height =
      `${height}px`;

    return {

      target:
        doc.documentElement,

      cleanup: () => {
        box.remove();
      }

    };
  }

  private dataUrlToBlob(
    dataUrl: string
  ): Blob {

    const parts =
      dataUrl.split(',');

    const header =
      parts[0];

    const data =
      parts[1];

    const mime =
      /data:(.*?);/
        .exec(header)?.[1]
        ||
      'application/octet-stream';

    const bytes =
      atob(data);

    const array =
      new Uint8Array(
        bytes.length
      );

    for (
      let i = 0;
      i < bytes.length;
      i++
    ) {

      array[i] =
        bytes.charCodeAt(i);

    }

    return new Blob(
      [array],
      {
        type: mime
      }
    );
  }

  private download(
    blob: Blob,
    name: string
  ): void {

    const url =
      URL.createObjectURL(
        blob
      );

    const anchor =
      document.createElement(
        'a'
      );

    anchor.href =
      url;

    anchor.download =
      name;

    document.body.appendChild(
      anchor
    );

    anchor.click();

    anchor.remove();

    setTimeout(
      () => {
        URL.revokeObjectURL(
          url
        );
      },
      1000
    );
  }

  private safeName(): string {

    return (
      this.template.name ||
      'brain-techno-template'
    )
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        '-'
      )
      .replace(
        /^-+|-+$/g,
        ''
      )
      ||
      'brain-techno-template';
  }

  private isValidDesign(
    design: unknown
  ): boolean {

    if (
      !design ||
      typeof design !== 'object'
    ) {
      return false;
    }

    const value =
      design as Record<
        string,
        unknown
      >;

    return !!value['body'];
  }

  private createEmptyDesign(): any {

    return {

      counters: {},

      body: {

        rows: [],

        values: {

          backgroundColor:
            '#ffffff',

          contentWidth:
            '600px',

          fontFamily: {

            label:
              'Arial',

            value:
              'arial,helvetica,sans-serif'

          }

        }

      },

      schemaVersion: 21
    };
  }

  private message(
    error: unknown
  ): string {

    if (
      error instanceof Error
    ) {

      return error.message;

    }

    return 'Unknown error';
  }
}