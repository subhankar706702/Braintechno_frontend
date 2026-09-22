import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import {
  DomSanitizer,
  SafeHtml,
} from '@angular/platform-browser';

@Component({
  selector: 'bt-htmlviewer',
  standalone: true,

  imports: [
    CommonModule,
  ],

  template: `
    <div
      class="preview-overlay"
      (click)="closePreview()"
    >
      <section
        class="preview-viewer"
        role="dialog"
        aria-modal="true"
        aria-label="Template preview"
        (click)="$event.stopPropagation()"
      >
        <header class="preview-header">

          <div class="preview-title">
            <strong>Preview</strong>

            <span>
              {{ mobile ? 'Mobile view' : 'Desktop view' }}
            </span>
          </div>

          <div class="preview-actions">

            <button
              type="button"
              class="preview-mode"
              [class.preview-mode--active]="mobile"
              (click)="setMobile(true)"
              aria-label="Mobile preview"
              title="Mobile preview"
            >
              <span
                class="material-symbols-rounded"
                aria-hidden="true"
              >
                smartphone
              </span>
            </button>

            <button
              type="button"
              class="preview-mode"
              [class.preview-mode--active]="!mobile"
              (click)="setMobile(false)"
              aria-label="Desktop preview"
              title="Desktop preview"
            >
              <span
                class="material-symbols-rounded"
                aria-hidden="true"
              >
                desktop_windows
              </span>
            </button>

            <span class="preview-divider"></span>

            <button
              type="button"
              class="preview-close"
              (click)="closePreview()"
              aria-label="Close preview"
              title="Close preview"
            >
              <span
                class="material-symbols-rounded"
                aria-hidden="true"
              >
                close
              </span>
            </button>

          </div>

        </header>

        <div
          class="preview-stage"
          [class.preview-stage--mobile]="mobile"
        >
          <div class="preview-device">

            @if (mobile) {
              <div class="preview-device__top">
                <span></span>
              </div>
            }

            <iframe
              title="Template preview"
              [srcdoc]="safeHtml"
            ></iframe>

          </div>
        </div>

      </section>
    </div>
  `,

  styles: [`
    :host {
      --preview-primary: #ff4d6d;
      --preview-bg: #f5f7fa;
      --preview-surface: #ffffff;
      --preview-surface-2: #f8fafc;
      --preview-border: #e2e8f0;
      --preview-text: #0f172a;
      --preview-text-secondary: #475569;

      position: relative;
      z-index: 1000;

      font-family:
        'Inter',
        'Noto Sans Bengali',
        sans-serif;
    }


    .preview-overlay {
      position: fixed;
      inset: 0;

      z-index: 1000;

      display: grid;
      place-items: center;

      padding: 16px;

      background:
        rgba(7, 17, 31, 0.72);

      backdrop-filter:
        blur(4px);
    }


    .preview-viewer {
      width: min(
        1450px,
        100%
      );

      height:
        calc(
          100dvh - 32px
        );

      min-height: 0;

      display: grid;

      grid-template-rows:
        64px
        minmax(0, 1fr);

      overflow: hidden;

      border:
        1px solid
        var(--preview-border);

      border-radius: 18px;

      background:
        var(--preview-surface);

      box-shadow:
        0 24px 70px
        rgba(0, 0, 0, 0.28);
    }


    .preview-header {
      min-width: 0;

      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 16px;

      padding:
        0 16px;

      border-bottom:
        1px solid
        var(--preview-border);

      background:
        var(--preview-surface);
    }


    .preview-title {
      min-width: 0;

      display: grid;

      gap: 2px;
    }


    .preview-title strong {
      overflow: hidden;

      color:
        var(--preview-text);

      font-size: 16px;
      font-weight: 700;

      text-overflow: ellipsis;
      white-space: nowrap;
    }


    .preview-title span {
      color:
        var(
          --preview-text-secondary
        );

      font-size: 12px;
    }


    .preview-actions {
      display: flex;
      align-items: center;

      gap: 6px;
    }


    .preview-mode,
    .preview-close {
      width: 40px;
      height: 40px;

      flex: 0 0 40px;

      display: inline-grid;
      place-items: center;

      padding: 0;

      border:
        1px solid
        var(--preview-border);

      border-radius: 10px;

      background:
        var(--preview-surface);

      color:
        var(
          --preview-text-secondary
        );

      cursor: pointer;

      transition:
        background 150ms ease,
        color 150ms ease,
        border-color 150ms ease,
        transform 150ms ease;
    }


    .preview-mode:hover,
    .preview-close:hover {
      background:
        var(--preview-surface-2);

      color:
        var(--preview-text);
    }


    .preview-mode:active,
    .preview-close:active {
      transform:
        scale(0.96);
    }


    .preview-mode--active {
      border-color:
        var(--preview-primary);

      background:
        rgba(
          255,
          77,
          109,
          0.1
        );

      color:
        var(--preview-primary);
    }


    .preview-close:hover {
      border-color:
        rgba(
          239,
          68,
          68,
          0.3
        );

      background:
        rgba(
          239,
          68,
          68,
          0.08
        );

      color:
        #ef4444;
    }


    .preview-mode .material-symbols-rounded,
    .preview-close .material-symbols-rounded {
      width: 22px;
      height: 22px;

      display: inline-flex;
      align-items: center;
      justify-content: center;

      font-size: 22px;
      line-height: 1;

      font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
    }


    .preview-divider {
      width: 1px;
      height: 26px;

      margin:
        0 3px;

      background:
        var(--preview-border);
    }


    .preview-stage {
      min-width: 0;
      min-height: 0;

      overflow: auto;

      padding: 20px;

      display: flex;
      align-items: stretch;
      justify-content: center;

      background:
        #e9edf2;
    }


    .preview-device {
      width: 100%;
      height: 100%;

      min-width: 0;
      min-height: 0;

      overflow: hidden;

      background:
        #ffffff;

      border:
        1px solid
        #dbe2ea;

      border-radius: 10px;

      box-shadow:
        0 8px 28px
        rgba(15, 23, 42, 0.08);

      transition:
        width 200ms ease,
        max-width 200ms ease,
        border-radius 200ms ease;
    }


    .preview-device iframe {
      width: 100%;
      height: 100%;

      min-height: 100%;

      display: block;

      border: 0;

      background:
        #ffffff;
    }


    .preview-stage--mobile {
      align-items: flex-start;

      padding:
        24px 16px;
    }


    .preview-stage--mobile
    .preview-device {
      width: min(
        390px,
        100%
      );

      height:
        min(
          844px,
          calc(
            100dvh - 145px
          )
        );

      min-height: 540px;

      flex: 0 0 auto;

      border:
        8px solid
        #111827;

      border-radius: 28px;

      background:
        #111827;

      box-shadow:
        0 18px 50px
        rgba(15, 23, 42, 0.2);
    }


    .preview-device__top {
      height: 22px;

      display: grid;
      place-items: center;

      background:
        #111827;
    }


    .preview-device__top span {
      width: 72px;
      height: 5px;

      display: block;

      border-radius: 999px;

      background:
        #374151;
    }


    .preview-stage--mobile
    .preview-device iframe {
      height:
        calc(
          100% - 22px
        );

      min-height: 0;

      border-radius:
        0 0 19px 19px;
    }


    @media (
      max-width: 767px
    ) {

      .preview-overlay {
        padding: 0;

        place-items: stretch;
      }


      .preview-viewer {
        width: 100%;
        height: 100dvh;

        border: 0;
        border-radius: 0;

        grid-template-rows:
          60px
          minmax(0, 1fr);
      }


      .preview-header {
        padding:
          0 12px;
      }


      .preview-title span {
        display: none;
      }


      .preview-mode,
      .preview-close {
        width: 42px;
        height: 42px;

        flex-basis: 42px;
      }


      .preview-divider {
        margin: 0;
      }


      .preview-stage {
        padding: 10px;
      }


      .preview-stage--mobile {
        padding:
          12px 8px;
      }


      .preview-stage--mobile
      .preview-device {
        width: min(
          390px,
          100%
        );

        height:
          calc(
            100dvh - 84px
          );

        min-height: 0;

        border-width: 5px;

        border-radius: 22px;
      }

    }
  `],
})
export class HtmlviewerComponent {

  @Output()
  readonly closed =
    new EventEmitter<void>();


  mobile = true;


  safeHtml: SafeHtml = '';


  constructor(
    private sanitizer:
      DomSanitizer,
  ) {}


  @Input()
  set html(
    value: string,
  ) {

    const html =
      String(
        value || '',
      ).trim();


    this.safeHtml =
      this.sanitizer
        .bypassSecurityTrustHtml(
          html ||
          `
            <!doctype html>
            <html>
              <body
                style="
                  margin:0;
                  padding:32px;
                  font-family:Arial,sans-serif;
                  color:#64748b;
                  text-align:center;
                "
              >
                No preview available.
              </body>
            </html>
          `,
        );

  }


  setMobile(
    value: boolean,
  ): void {

    this.mobile =
      value;

  }


  closePreview(): void {

    this.closed.emit();

  }

}