import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';

declare global {

  interface Window {

    unlayer?: {

      createEditor(
        options: Record<
          string,
          unknown
        >
      ): any;

    };

  }

}

@Component({
  selector: 'bt-unlayer-editor',

  standalone: true,

  template: `
    <div
      class="editor-host"
      [id]="editorId"
    ></div>
  `,

  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 650px;
    }

    .editor-host {
      display: block;
      width: 100%;
      height: calc(100vh - 150px);
      min-height: 650px;
      background: #ffffff;
    }
  `]
})
export class UnlayerEditorComponent
  implements AfterViewInit, OnDestroy {

  @Input()
  design: unknown;

  @Output()
  readonly ready =
    new EventEmitter<void>();

  @Output()
  readonly changed =
    new EventEmitter<void>();

  readonly editorId =
    'brain-techno-editor-' +
    Date.now() +
    '-' +
    Math.random()
      .toString(36)
      .slice(2);

  private editor: any;

  private editorReady = false;

  private destroyed = false;

  private pendingDesign:
    unknown = null;

  private static loadPromise?:
    Promise<void>;

  async ngAfterViewInit():
    Promise<void> {

    try {

      console.log(
        '[Unlayer] component initialized'
      );

      /*
       * Remember initial MongoDB design.
       */
      if (
        this.design &&
        typeof this.design === 'object'
      ) {

        this.pendingDesign =
          this.design;

      }

      console.log(
        '[Unlayer] loading /assets/js/embed.js'
      );

      await this.loadScript();

      if (this.destroyed) {
        return;
      }

      console.log(
        '[Unlayer] script loaded'
      );

      this.createEditor();

    } catch (error) {

      console.error(
        '[Unlayer] initialization failed:',
        error
      );

    }
  }

  ngOnDestroy(): void {

    this.destroyed =
      true;

    this.editorReady =
      false;

    try {

      if (
        this.editor &&
        typeof this.editor.destroy ===
          'function'
      ) {

        this.editor.destroy();

      }

    } catch (error) {

      console.error(
        '[Unlayer] destroy failed:',
        error
      );

    }

    this.editor =
      undefined;
  }

  /**
   * Public design loader.
   *
   * If editor isn't ready,
   * store the design.
   *
   * editor:ready will load it later.
   */
  loadDesign(
    design: unknown
  ): void {

    if (
      !design ||
      typeof design !== 'object'
    ) {

      console.warn(
        '[Unlayer] Invalid design ignored'
      );

      return;
    }

    /*
     * Always keep latest design.
     */
    this.pendingDesign =
      design;

    if (
      !this.editor ||
      !this.editorReady
    ) {

      console.log(
        '[Unlayer] Editor not ready. Design queued.'
      );

      return;
    }

    this.applyDesign(
      design
    );
  }

  /**
   * Get current editor JSON.
   */
  saveDesign():
    Promise<any> {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        if (
          !this.editor ||
          !this.editorReady
        ) {

          reject(
            new Error(
              'Editor is not ready.'
            )
          );

          return;
        }

        try {

          this.editor.saveDesign(
            (
              design: unknown
            ) => {

              resolve(
                design
              );

            }
          );

        } catch (error) {

          reject(
            error
          );

        }

      }
    );
  }

  /**
   * Export HTML.
   */
  exportHtml():
    Promise<{
      html: string;
      design?: unknown;
    }> {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        if (
          !this.editor ||
          !this.editorReady
        ) {

          reject(
            new Error(
              'Editor is not ready.'
            )
          );

          return;
        }

        try {

          this.editor.exportHtml(
            (
              data: {
                html: string;
                design?: unknown;
              }
            ) => {

              resolve(
                data
              );

            }
          );

        } catch (error) {

          reject(
            error
          );

        }

      }
    );
  }

  /**
   * Create editor instance.
   */
  private createEditor(): void {

    if (
      !window.unlayer ||
      typeof window.unlayer.createEditor !==
        'function'
    ) {

      throw new Error(
        'window.unlayer.createEditor is unavailable.'
      );

    }

    const host =
      document.getElementById(
        this.editorId
      );

    if (!host) {

      throw new Error(
        `Editor host "${this.editorId}" was not found.`
      );

    }

    console.log(
      '[Unlayer] creating editor:',
      this.editorId
    );

    this.editor =
      window.unlayer.createEditor({

        id:
          this.editorId,

        displayMode:
          'web',

        appearance: {

          theme:
            'light',

          panels: {

            tools: {
              dock:
                'right'
            }

          }

        },

        tools: {

          text: {
            enabled: true
          },

          image: {
            enabled: true
          },

          button: {
            enabled: true
          },

          divider: {
            enabled: true
          },

          html: {
            enabled: true
          },

          social: {
            enabled: true
          },

          form: {
            enabled: true
          }

        }

      });

    if (!this.editor) {

      throw new Error(
        'Unlayer createEditor returned no editor instance.'
      );

    }

    /*
     * IMPORTANT:
     * use editor instance events.
     */
    this.editor.addEventListener(
      'editor:ready',
      () => {

        if (this.destroyed) {
          return;
        }

        console.log(
          '[Unlayer] editor:ready'
        );

        this.editorReady =
          true;

        /*
         * Imported JSON has priority.
         * Otherwise use original input.
         */
        const design =
          this.pendingDesign ||
          this.design;

        if (
          design &&
          typeof design === 'object'
        ) {

          this.applyDesign(
            design
          );

        }

        this.ready.emit();

      }
    );

    this.editor.addEventListener(
      'design:updated',
      () => {

        if (
          this.destroyed ||
          !this.editorReady
        ) {
          return;
        }

        this.changed.emit();

      }
    );
  }

  /**
   * Apply actual JSON to Unlayer.
   */
  private applyDesign(
    design: unknown
  ): void {

    if (
      !this.editor ||
      !this.editorReady
    ) {

      this.pendingDesign =
        design;

      return;
    }

    try {

      console.log(
        '[Unlayer] loadDesign:',
        design
      );

      this.editor.loadDesign(
        design
      );

      this.pendingDesign =
        null;

    } catch (error) {

      console.error(
        '[Unlayer] loadDesign failed:',
        error
      );

      /*
       * Keep it available for retry.
       */
      this.pendingDesign =
        design;

    }
  }

  /**
   * Load local Unlayer bundle.
   */
  private loadScript():
    Promise<void> {

    /*
     * Already initialized.
     */
    if (
      window.unlayer &&
      typeof window.unlayer.createEditor ===
        'function'
    ) {

      return Promise.resolve();

    }

    /*
     * Another component is loading it.
     */
    if (
      UnlayerEditorComponent
        .loadPromise
    ) {

      return UnlayerEditorComponent
        .loadPromise;

    }

    UnlayerEditorComponent
      .loadPromise =
      new Promise<void>(
        (
          resolve,
          reject
        ) => {

          /*
           * If script already exists,
           * don't insert duplicates.
           */
          const existing =
            document.querySelector<
              HTMLScriptElement
            >(
              'script[data-brain-techno-unlayer="true"]'
            );

          if (existing) {

            console.log(
              '[Unlayer] Existing script detected'
            );

            const started =
              Date.now();

            const waitForApi =
              () => {

                if (
                  window.unlayer &&
                  typeof window.unlayer
                    .createEditor ===
                    'function'
                ) {

                  resolve();

                  return;
                }

                if (
                  Date.now() -
                  started >
                  15000
                ) {

                  reject(
                    new Error(
                      'Unlayer script exists but createEditor was not exposed.'
                    )
                  );

                  return;
                }

                setTimeout(
                  waitForApi,
                  50
                );
              };

            waitForApi();

            return;
          }

          const script =
            document.createElement(
              'script'
            );

          script.src =
            '/assets/js/embed.js';

          script.async =
            true;

          script.dataset[
            'brainTechnoUnlayer'
          ] =
            'true';

          const timeout =
            window.setTimeout(
              () => {

                reject(
                  new Error(
                    'Timed out loading /assets/js/embed.js'
                  )
                );

              },
              15000
            );

          script.onload =
            () => {

              console.log(
                '[Unlayer] embed.js load event'
              );

              const started =
                Date.now();

              const waitForApi =
                () => {

                  if (
                    window.unlayer &&
                    typeof window.unlayer
                      .createEditor ===
                      'function'
                  ) {

                    window.clearTimeout(
                      timeout
                    );

                    resolve();

                    return;
                  }

                  if (
                    Date.now() -
                    started >
                    5000
                  ) {

                    window.clearTimeout(
                      timeout
                    );

                    reject(
                      new Error(
                        'embed.js loaded but window.unlayer.createEditor is unavailable.'
                      )
                    );

                    return;
                  }

                  setTimeout(
                    waitForApi,
                    50
                  );
                };

              waitForApi();

            };

          script.onerror =
            () => {

              window.clearTimeout(
                timeout
              );

              reject(
                new Error(
                  'Could not load /assets/js/embed.js'
                )
              );

            };

          document.head.appendChild(
            script
          );

        }
      )
      .catch(
        error => {

          /*
           * Allow another retry later.
           */
          UnlayerEditorComponent
            .loadPromise =
            undefined;

          throw error;

        }
      );

    return UnlayerEditorComponent
      .loadPromise;
  }
}