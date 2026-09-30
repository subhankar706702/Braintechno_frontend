import {
  Component,
  OnInit,
  ViewChild,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { html2canvas } from '../vendor-bridge';
import { jsPDF } from 'jspdf';

import { TemplateDraft } from '../../../core/models';
import { TemplateStorageService } from '../../../core/template-storage.service';

import { HtmlviewerComponent } from '../htmlviewer.component';
import { BraintechnoEditorComponent } from '../braintechno-editor/braintechno-editor.component';

type EditorToastKind = 'success' | 'error' | 'warning' | 'info';
type PendingEditorAction = 'blank' | 'gallery' | null;

interface EditorToast {
  kind: EditorToastKind;
  title: string;
  message: string;
}

@Component({
  selector: 'app-template-editor',
  standalone: true,

  imports: [
    FormsModule,
    RouterLink,
    BraintechnoEditorComponent,
    HtmlviewerComponent
  ],

  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent implements OnInit {

  @ViewChild('editor')
  editor?: BraintechnoEditorComponent;

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

  readonly showMetaEditor = signal(false);
  readonly addMenuOpen = signal(false);
  readonly saveAsMenuOpen = signal(false);
  readonly pendingAction = signal<PendingEditorAction>(null);
  readonly toast = signal<EditorToast | null>(null);

  editName = '';
  editDescription = '';

  private toastTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

        this.notify(
          'error',
          'Template unavailable',
          'Template id is missing.'
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

        this.notify(
          'error',
          'Template not found',
          'No data was found for this template.'
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

      this.notify(
        'error',
        'Template load failed',
        this.message(error) || 'Could not load the template.'
      );

    } finally {

      this.loading.set(false);

    }
  }

  /**
   * Page editor ready.
   *
   * The child loads the input design itself.
   * Do not call loadDesign() from here, otherwise
   * ready -> loadDesign -> ready creates a reload loop.
   */
  onReady(): void {

    console.log(
      '[Template Editor] Page editor ready'
    );

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

      this.notify(
        'error',
        'Editor not ready',
        'Please wait for the editor to finish loading.'
      );

      return;
    }

    if (!this.template.id) {

      this.notify(
        'error',
        'Template unavailable',
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

      this.notify(
        'success',
        'Template saved',
        'Your latest changes have been saved successfully.'
      );

    } catch (error) {

      console.error(
        '[Template Editor] Save failed:',
        error
      );

      this.status.set(
        'Save failed'
      );

      this.notify(
        'error',
        'Save failed',
        this.message(error)
      );

    } finally {

      this.busy.set(false);

    }
  }

  /**
   * Import  JSON.
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
 async importJson(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  try {
    this.busy.set(true);
    this.status.set('Importing JSON...');

    const text = await file.text();
    const parsed = JSON.parse(text);

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      throw new Error(
        'JSON root must be an object.'
      );
    }

    /*
     * If JSON contains a "design" object,
     * use that as the editor design.
     *
     * Otherwise use the complete JSON object
     * directly as the editor design.
     */
    const design =
      parsed.design &&
      typeof parsed.design === 'object' &&
      !Array.isArray(parsed.design)
        ? parsed.design
        : parsed;

    /*
     * Validate the final design object.
     */
    if (!this.isValidDesign(design)) {
      throw new Error(
        'This file is not a valid BRAIN TECHNO design JSON.'
      );
    }

    console.log(
      '[Template Editor] Imported JSON:',
      design
    );

    /*
     * Update current template.
     */
    this.template = {
      ...this.template,
      design,
      html: ''
    };

    /*
     * Load into editor.
     */
    if (this.editor) {
      this.editor.loadDesign(design);
    }

    this.dirty.set(true);

    this.status.set('JSON imported');

    this.notify(
      'success',
      'Design imported',
      'The JSON design was imported successfully.'
    );

  } catch (error) {

    console.error(
      '[Template Editor] JSON import failed:',
      error
    );

    this.status.set('Import failed');

    this.notify(
      'error',
      'Import failed',
      error instanceof Error
        ? error.message
        : 'Please select a valid BRAIN TECHNO design JSON file.'
    );

  } finally {

    this.busy.set(false);

    /*
     * Allows selecting the same file again.
     */
    input.value = '';
  }
}

  /**
   * Start blank design.
   */
  async newDesign(): Promise<void> {

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

    this.notify(
      'success',
      'Blank design ready',
      'A new blank design is ready to edit.'
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

      this.notify(
        'success',
        'Preview ready',
        'Your current design is ready to preview.'
      );

    } catch (error) {

      console.error(
        '[Template Editor] Preview failed:',
        error
      );

      this.notify(
        'error',
        'Preview failed',
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

      this.notify(
        'success',
        'JSON downloaded',
        'The design JSON file was downloaded successfully.'
      );

    } catch (error) {

      console.error(
        '[Template Editor] JSON export failed:',
        error
      );

      this.notify(
        'error',
        'JSON export failed',
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

      this.notify(
        'success',
        'HTML downloaded',
        'The HTML file was downloaded successfully.'
      );

    } catch (error) {

      console.error(
        '[Template Editor] HTML export failed:',
        error
      );

      this.notify(
        'error',
        'HTML export failed',
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

      this.notify(
        'success',
        'JPG downloaded',
        'The JPG image was downloaded successfully.'
      );

    } catch (error) {

      console.error(
        '[Template Editor] JPG export failed:',
        error
      );

      this.notify(
        'error',
        'JPG export failed',
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

      this.notify(
        'success',
        'PDF downloaded',
        'The PDF file was downloaded successfully.'
      );

    } catch (error) {

      console.error(
        '[Template Editor] PDF export failed:',
        error
      );

      this.notify(
        'error',
        'PDF export failed',
        this.message(error)
      );

    } finally {

      capture?.cleanup();

      this.busy.set(false);

    }
  }

  openMetaEditor(): void {
    this.editName = this.template.name || '';
    this.editDescription = this.template.description || '';
    this.showMetaEditor.set(true);
    this.closeMenus();
  }

  closeMetaEditor(): void {
    this.showMetaEditor.set(false);
  }

  applyMetaEditor(): void {
    const name = String(this.editName || '').trim();

    if (!name) {
      this.notify(
        'error',
        'Template name required',
        'Please enter a template name before saving the details.'
      );
      return;
    }

    this.template = {
      ...this.template,
      name,
      description: String(this.editDescription || '').trim()
    };

    this.markDirty();
    this.showMetaEditor.set(false);

    this.notify(
      'success',
      'Template details updated',
      'Title and description were updated.'
    );
  }

  toggleAddMenu(): void {
    this.saveAsMenuOpen.set(false);
    this.addMenuOpen.update(value => !value);
  }

  toggleSaveAsMenu(): void {
    this.addMenuOpen.set(false);
    this.saveAsMenuOpen.update(value => !value);
  }

  closeMenus(): void {
    this.addMenuOpen.set(false);
    this.saveAsMenuOpen.set(false);
  }

  requestBlankDesign(): void {
    this.closeMenus();

    if (this.dirty()) {
      this.pendingAction.set('blank');
      this.notify(
        'warning',
        'Unsaved changes',
        'Starting a blank design will discard the current unsaved changes.'
      );
      return;
    }

    void this.newDesign();
  }

  requestGallery(): void {
    this.closeMenus();

    if (this.dirty()) {
      this.pendingAction.set('gallery');
      this.notify(
        'warning',
        'Unsaved changes',
        'Open the gallery only after saving if you want to keep these changes.'
      );
      return;
    }

    void this.router.navigateByUrl('/app/templates');
  }

  cancelPendingAction(): void {
    this.pendingAction.set(null);
  }

  confirmPendingAction(): void {
    const action = this.pendingAction();
    this.pendingAction.set(null);

    if (action === 'blank') {
      void this.newDesign();
      return;
    }

    if (action === 'gallery') {
      void this.router.navigateByUrl('/app/templates');
    }
  }

  triggerImport(input: HTMLInputElement): void {
    this.closeMenus();
    input.click();
  }

  private notify(
    kind: EditorToastKind,
    title: string,
    message: string
  ): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toast.set({ kind, title, message });

    this.toastTimer = setTimeout(() => {
      this.toast.set(null);
      this.toastTimer = undefined;
    }, 4200);
  }

  dismissToast(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = undefined;
    }

    this.toast.set(null);
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