import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  DomSanitizer,
  SafeHtml
} from '@angular/platform-browser';

import {
  TemplateDraft
} from '../core/models';

import {
  TemplateStorageService
} from '../core/template-storage.service';

type PreviewMode =
  'desktop' |
  'tablet' |
  'mobile';

@Component({
  standalone: true,

  imports: [
    RouterLink
  ],

  template: `
    <div class="template-view-page">

      <header class="template-view-header">

        <a
          class="back-button"
          routerLink="/app/templates"
          aria-label="Back to templates"
          title="Back to templates"
        >
          <span
            class="material-symbols-rounded"
            aria-hidden="true"
          >
            arrow_back
          </span>
        </a>


        <div class="template-view-header__copy">

          <h1>
            {{
              template?.name ||
              'Template preview'
            }}
          </h1>

          @if (template?.description) {
            <p>
              {{ template?.description }}
            </p>
          }

        </div>


        @if (template) {

          <div
            class="preview-switcher"
            role="group"
            aria-label="Preview device"
          >

            <button
              type="button"
              class="preview-switcher__button"
              [class.preview-switcher__button--active]="
                previewMode === 'desktop'
              "
              (click)="setPreviewMode('desktop')"
              aria-label="Desktop preview"
              title="Desktop preview"
            >
              <span
                class="material-symbols-rounded"
                aria-hidden="true"
              >
                desktop_windows
              </span>

              <span class="preview-switcher__label">
                Desktop
              </span>
            </button>


            <button
              type="button"
              class="preview-switcher__button"
              [class.preview-switcher__button--active]="
                previewMode === 'tablet'
              "
              (click)="setPreviewMode('tablet')"
              aria-label="Tablet preview"
              title="Tablet preview"
            >
              <span
                class="material-symbols-rounded"
                aria-hidden="true"
              >
                tablet_mac
              </span>

              <span class="preview-switcher__label">
                Tablet
              </span>
            </button>


            <button
              type="button"
              class="preview-switcher__button"
              [class.preview-switcher__button--active]="
                previewMode === 'mobile'
              "
              (click)="setPreviewMode('mobile')"
              aria-label="Mobile preview"
              title="Mobile preview"
            >
              <span
                class="material-symbols-rounded"
                aria-hidden="true"
              >
                smartphone
              </span>

              <span class="preview-switcher__label">
                Mobile
              </span>
            </button>

          </div>


          <a
            class="edit-button"
            [routerLink]="[
              '/template',
              template.id
            ]"
          >
            <span
              class="material-symbols-rounded"
              aria-hidden="true"
            >
              edit
            </span>

            <span class="edit-button__label">
              Edit
            </span>
          </a>

        }

      </header>


      @if (loading) {

        <section class="view-state">

          <span
            class="view-state__spinner"
            aria-hidden="true"
          ></span>

          <div>
            <strong>
              Loading template
            </strong>

            <p>
              Preparing your preview...
            </p>
          </div>

        </section>

      } @else if (
        loadError ||
        !template
      ) {

        <section
          class="
            view-state
            view-state--error
          "
        >

          <span
            class="
              view-state__icon
              material-symbols-rounded
            "
            aria-hidden="true"
          >
            error
          </span>

          <div>
            <strong>
              Template unavailable
            </strong>

            <p>
              {{
                loadError ||
                'Template not found.'
              }}
            </p>
          </div>


          <a
            class="state-back"
            routerLink="/app/templates"
          >
            Back to templates
          </a>

        </section>

      } @else {

        <main
          class="preview-shell"
          [class.preview-shell--desktop]="
            previewMode === 'desktop'
          "
          [class.preview-shell--tablet]="
            previewMode === 'tablet'
          "
          [class.preview-shell--mobile]="
            previewMode === 'mobile'
          "
        >

          <div class="preview-stage">

            <div
              class="preview-device"
              [class.preview-device--desktop]="
                previewMode === 'desktop'
              "
              [class.preview-device--tablet]="
                previewMode === 'tablet'
              "
              [class.preview-device--mobile]="
                previewMode === 'mobile'
              "
            >

              @if (
                previewMode === 'tablet' ||
                previewMode === 'mobile'
              ) {
                <div class="preview-device__top">
                  <span></span>
                </div>
              }


              @if (previewHtml) {

                <iframe
                  class="template-frame"
                  title="Template preview"
                  [srcdoc]="previewHtml"
                ></iframe>

              } @else if (previewUrl) {

                <div class="image-preview">

                  <img
                    [src]="previewUrl"
                    [alt]="template.name"
                  />

                </div>

              } @else {

                <section class="view-state view-state--inside">

                  <span
                    class="
                      view-state__icon
                      material-symbols-rounded
                    "
                    aria-hidden="true"
                  >
                    image_not_supported
                  </span>

                  <div>
                    <strong>
                      Preview not available
                    </strong>

                    <p>
                      Open this template in Edit
                      and save it once to generate
                      the preview.
                    </p>
                  </div>


                  <a
                    class="state-back"
                    [routerLink]="[
                      '/template',
                      template.id
                    ]"
                  >
                    Open editor
                  </a>

                </section>

              }

            </div>

          </div>

        </main>

      }

    </div>
  `,

  styles: [`
    :host {
      --bt-primary: #ff4d6d;
      --bt-primary-hover: #ff6680;
      --bt-bg: #f5f7fa;
      --bt-surface: #ffffff;
      --bt-surface-2: #f8fafc;
      --bt-border: #e2e8f0;
      --bt-text: #0f172a;
      --bt-text-secondary: #475569;
      --bt-text-muted: #64748b;

      display: block;
      min-height: 100%;

      font-family:
        'Inter',
        'Noto Sans Bengali',
        sans-serif;
    }


    * {
      box-sizing: border-box;
    }


    button,
    a {
      font: inherit;
    }


    .template-view-page {
      min-height: 100vh;

      padding: 14px;

      background:
        var(--bt-bg);
    }


    /* =========================
       Header
       ========================= */

    .template-view-header {
      min-height: 64px;

      display: flex;
      align-items: center;

      gap: 10px;

      margin-bottom: 12px;

      padding:
        9px 10px;

      border:
        1px solid
        var(--bt-border);

      border-radius: 14px;

      background:
        var(--bt-surface);
    }


    .back-button {
      width: 42px;
      height: 42px;

      flex: 0 0 42px;

      display: grid;
      place-items: center;

      border:
        1px solid
        var(--bt-border);

      border-radius: 10px;

      background:
        var(--bt-surface);

      color:
        var(--bt-text-secondary);

      text-decoration: none;

      transition:
        150ms ease;
    }


    .back-button:hover {
      color:
        var(--bt-primary);

      border-color:
        rgba(
          255,
          77,
          109,
          .35
        );

      background:
        rgba(
          255,
          77,
          109,
          .05
        );
    }


    .back-button
    .material-symbols-rounded {
      font-size: 21px;
    }


    .template-view-header__copy {
      min-width: 0;

      flex: 1 1 auto;

      display: grid;

      gap: 2px;
    }


    .template-view-header__copy h1 {
      margin: 0;

      overflow: hidden;

      color:
        var(--bt-text);

      font-size: 18px;
      font-weight: 800;

      line-height: 1.3;

      text-overflow: ellipsis;
      white-space: nowrap;
    }


    .template-view-header__copy p {
      margin: 0;

      overflow: hidden;

      color:
        var(--bt-text-muted);

      font-size: 11.5px;

      line-height: 1.35;

      text-overflow: ellipsis;
      white-space: nowrap;
    }


    /* =========================
       Device switcher
       ========================= */

    .preview-switcher {
      display: inline-flex;
      align-items: center;

      gap: 4px;

      padding: 4px;

      border:
        1px solid
        var(--bt-border);

      border-radius: 10px;

      background:
        var(--bt-surface-2);
    }


    .preview-switcher__button {
      min-height: 34px;

      display: inline-flex;
      align-items: center;
      justify-content: center;

      gap: 6px;

      padding:
        0 10px;

      border: 0;

      border-radius: 8px;

      background:
        transparent;

      color:
        var(--bt-text-secondary);

      cursor: pointer;

      transition:
        background 150ms ease,
        color 150ms ease,
        box-shadow 150ms ease;
    }


    .preview-switcher__button:hover {
      color:
        var(--bt-text);

      background:
        rgba(
          15,
          23,
          42,
          .04
        );
    }


    .preview-switcher__button--active {
      background:
        var(--bt-surface);

      color:
        var(--bt-primary);

      box-shadow:
        0 1px 4px
        rgba(
          15,
          23,
          42,
          .09
        );
    }


    .preview-switcher__button
    .material-symbols-rounded {
      font-size: 18px;
    }


    .preview-switcher__label {
      font-size: 12px;
      font-weight: 700;
    }


    .edit-button,
    .state-back {
      min-height: 40px;

      display: inline-flex;
      align-items: center;
      justify-content: center;

      gap: 7px;

      padding:
        0 13px;

      border: 0;

      border-radius: 10px;

      background:
        var(--bt-primary);

      color: #ffffff;

      font-weight: 700;

      text-decoration: none;

      white-space: nowrap;

      transition:
        background 150ms ease,
        transform 150ms ease;
    }


    .edit-button:hover,
    .state-back:hover {
      background:
        var(--bt-primary-hover);

      transform:
        translateY(-1px);
    }


    .edit-button
    .material-symbols-rounded {
      font-size: 18px;
    }


    /* =========================
       Preview area
       ========================= */

    .preview-shell {
      min-height:
        calc(
          100vh -
          102px
        );

      overflow: hidden;

      border:
        1px solid
        var(--bt-border);

      border-radius: 14px;

      background:
        #e9edf2;
    }


    .preview-stage {
      width: 100%;
      height:
        calc(
          100vh -
          104px
        );

      min-height: 620px;

      overflow: auto;

      display: flex;
      align-items: flex-start;
      justify-content: center;

      padding: 18px;
    }


    .preview-device {
      position: relative;

      overflow: hidden;

      flex: 0 0 auto;

      background:
        #ffffff;

      border:
        1px solid
        #d8e0e8;

      transition:
        width 200ms ease,
        border-radius 200ms ease,
        box-shadow 200ms ease;
    }


    .preview-device--desktop {
      width: min(
        1200px,
        100%
      );

      min-height:
        calc(
          100vh -
          142px
        );

      border-radius: 8px;

      box-shadow:
        0 8px 28px
        rgba(
          15,
          23,
          42,
          .08
        );
    }


    .preview-device--tablet {
      width: min(
        768px,
        100%
      );

      min-height: 900px;

      border:
        8px solid
        #111827;

      border-radius: 24px;

      background:
        #111827;

      box-shadow:
        0 18px 46px
        rgba(
          15,
          23,
          42,
          .16
        );
    }


    .preview-device--mobile {
      width: min(
        390px,
        100%
      );

      min-height: 760px;

      border:
        7px solid
        #111827;

      border-radius: 28px;

      background:
        #111827;

      box-shadow:
        0 18px 46px
        rgba(
          15,
          23,
          42,
          .18
        );
    }


    .preview-device__top {
      height: 22px;

      display: grid;
      place-items: center;

      background:
        #111827;
    }


    .preview-device__top span {
      width: 68px;
      height: 5px;

      display: block;

      border-radius: 999px;

      background:
        #374151;
    }


    .template-frame {
      width: 100%;

      height:
        calc(
          100vh -
          144px
        );

      min-height: 680px;

      display: block;

      border: 0;

      background:
        #ffffff;
    }


    .preview-device--tablet
    .template-frame {
      min-height: 878px;

      height: 878px;
    }


    .preview-device--mobile
    .template-frame {
      min-height: 738px;

      height: 738px;
    }


    .image-preview {
      width: 100%;

      min-height: inherit;

      display: flex;
      align-items: flex-start;
      justify-content: center;

      overflow: auto;

      padding: 12px;

      background:
        #eef2f6;
    }


    .image-preview img {
      max-width: 100%;

      height: auto;

      display: block;

      border-radius: 8px;

      background:
        #ffffff;
    }


    /* =========================
       States
       ========================= */

    .view-state {
      min-height: 300px;

      display: flex;
      align-items: center;
      justify-content: center;

      gap: 14px;

      padding: 28px;

      border:
        1px solid
        var(--bt-border);

      border-radius: 14px;

      background:
        var(--bt-surface);

      color:
        var(--bt-text-secondary);
    }


    .view-state--inside {
      border: 0;

      border-radius: 0;
    }


    .view-state__icon {
      width: 46px;
      height: 46px;

      flex: 0 0 46px;

      display: grid;
      place-items: center;

      border-radius: 12px;

      background:
        #f1f5f9;

      color:
        var(--bt-text-muted);
    }


    .view-state--error
    .view-state__icon {
      background:
        rgba(
          239,
          68,
          68,
          .09
        );

      color:
        #ef4444;
    }


    .view-state strong {
      display: block;

      margin-bottom: 4px;

      color:
        var(--bt-text);

      font-size: 16px;
    }


    .view-state p {
      margin: 0;

      font-size: 13px;
    }


    .view-state__spinner {
      width: 30px;
      height: 30px;

      border:
        3px solid
        #e2e8f0;

      border-top-color:
        var(--bt-primary);

      border-radius: 999px;

      animation:
        bt-view-spin
        .8s linear
        infinite;
    }


    @keyframes bt-view-spin {
      to {
        transform:
          rotate(
            360deg
          );
      }
    }


    .state-back {
      margin-left: 12px;
    }


    /* =========================
       Tablet / mobile page UI
       ========================= */

    @media (
      max-width: 1023px
    ) {

      .template-view-header {
        flex-wrap: wrap;
      }


      .template-view-header__copy {
        min-width:
          calc(
            100% -
            110px
          );
      }


      .preview-switcher {
        order: 4;

        width: 100%;
      }


      .preview-switcher__button {
        flex: 1 1 0;
      }


      .preview-stage {
        height:
          calc(
            100dvh -
            150px
          );

        min-height: 560px;
      }

    }


    @media (
      max-width: 767px
    ) {

      .template-view-page {
        padding: 8px;
      }


      .template-view-header {
        min-height: 58px;

        gap: 7px;

        margin-bottom: 8px;

        padding: 7px;
      }


      .back-button {
        width: 40px;
        height: 40px;

        flex-basis: 40px;
      }


      .template-view-header__copy {
        min-width: 0;
      }


      .template-view-header__copy h1 {
        font-size: 15px;
      }


      .template-view-header__copy p {
        display: none;
      }


      .edit-button {
        width: 40px;
        min-width: 40px;

        min-height: 40px;

        padding: 0;
      }


      .edit-button__label {
        display: none;
      }


      .preview-switcher {
        gap: 2px;

        padding: 3px;
      }


      .preview-switcher__button {
        min-height: 38px;

        padding:
          0 8px;
      }


      .preview-switcher__label {
        display: none;
      }


      .preview-switcher__button
      .material-symbols-rounded {
        font-size: 20px;
      }


      .preview-shell {
        min-height:
          calc(
            100dvh -
            116px
          );

        border-radius: 10px;
      }


      .preview-stage {
        height:
          calc(
            100dvh -
            118px
          );

        min-height: 0;

        padding: 10px 6px;
      }


      .preview-device--desktop {
        width: 1200px;

        min-height: 700px;
      }


      .preview-device--tablet {
        width: 768px;

        min-height: 900px;
      }


      .preview-device--mobile {
        width: min(
          390px,
          100%
        );

        min-height:
          calc(
            100dvh -
            142px
          );
      }


      .preview-device--mobile
      .template-frame {
        height:
          calc(
            100dvh -
            164px
          );

        min-height:
          620px;
      }


      .view-state {
        min-height: 240px;

        flex-direction: column;

        padding:
          22px 16px;

        text-align: center;
      }


      .state-back {
        width: 100%;

        margin-left: 0;
        margin-top: 4px;
      }

    }
  `]
})
export class TemplateViewComponent {

  template?: TemplateDraft;

  previewUrl = '';

  previewHtml:
    SafeHtml | null =
    null;

  previewMode:
    PreviewMode =
    'desktop';

  loading = true;

  loadError = '';


  constructor(
    private route:
      ActivatedRoute,

    private storage:
      TemplateStorageService,

    private sanitizer:
      DomSanitizer,

    private cdr:
      ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.previewMode =
      window.innerWidth <
      768
        ? 'mobile'
        : 'desktop';

    void this.load();

  }


  setPreviewMode(
    mode: PreviewMode
  ): void {

    this.previewMode =
      mode;

  }


  private async load():
    Promise<void> {

    this.loading = true;
    this.loadError = '';

    this.cdr.detectChanges();

    try {

      const id =
        this.route.snapshot
          .paramMap
          .get('id')
          ?.trim() ||
        '';

      if (!id) {

        this.loadError =
          'Template id is missing.';

        return;

      }


      const template =
        await this.storage.get(
          id
        );


      if (!template) {

        this.loadError =
          'Template not found.';

        return;

      }


      this.template =
        template;


      const html =
        String(
          template.html ||
          ''
        ).trim();


      if (html) {

        this.previewHtml =
          this.sanitizer
            .bypassSecurityTrustHtml(
              html
            );

      } else {

        this.previewHtml =
          null;

      }


      this.previewUrl =
        this.storage
          .previewUrl(
            template
          ) ||
        '';

    } catch (error) {

      console.error(
        'Failed to load template preview:',
        error
      );


      this.loadError =
        this.message(
          error
        ) ||
        'Could not load the template.';

    } finally {

      this.loading =
        false;

      this.cdr.detectChanges();

    }

  }


  private message(
    error: unknown
  ): string {

    if (
      error &&
      typeof error ===
        'object'
    ) {

      const value =
        error as {
          message?: unknown;
          error?: {
            message?: unknown;
          };
        };


      const apiMessage =
        String(
          value.error
            ?.message ||
          ''
        ).trim();


      if (apiMessage) {
        return apiMessage;
      }


      const message =
        String(
          value.message ||
          ''
        ).trim();


      if (message) {
        return message;
      }

    }


    if (
      error instanceof
      Error
    ) {

      return error.message;

    }


    return '';

  }

}
