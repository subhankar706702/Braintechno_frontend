import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ThemeMode, ThemeService } from '../../core/theme.service';

type DensityMode = 'comfortable' | 'compact';
type SidebarMode = 'expanded' | 'collapsed';
type PreviewMode = 'desktop' | 'tablet' | 'mobile';

@Component({
  selector: 'bt-system-settings-page',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './system.page.html',
  styleUrl: './system.page.scss',
})
export class SystemPage {


  private readonly themeService =
    inject(ThemeService);


  readonly theme =
    this.themeService.theme;

  readonly density =
    signal<DensityMode>(
      'comfortable',
    );

  readonly sidebarMode =
    signal<SidebarMode>(
      'expanded',
    );

  readonly defaultPreview =
    signal<PreviewMode>(
      'desktop',
    );

  readonly reduceAnimations =
    signal(false);

  readonly pageTransitions =
    signal(true);

  readonly browserNotifications =
    signal(true);

  readonly enquiryAlerts =
    signal(true);

  readonly campaignAlerts =
    signal(true);

  readonly expiryAlerts =
    signal(true);

  readonly autoSave =
    signal(true);

  readonly showGrid =
    signal(false);

  readonly snapElements =
    signal(true);

  readonly confirmDelete =
    signal(true);

  readonly restoreLastDesign =
    signal(true);

  readonly highContrast =
    signal(false);

  readonly largerText =
    signal(false);

  readonly keyboardShortcuts =
    signal(true);

  readonly analytics =
    signal(true);
  setTheme(
    theme: ThemeMode,
  ): void {

    this.themeService.setTheme(
      theme,
    );

  }

  setDensity(
    density: DensityMode,
  ): void {

    this.density.set(
      density,
    );

  }

  setSidebarMode(
    mode: SidebarMode,
  ): void {

    this.sidebarMode.set(
      mode,
    );

  }

  setDefaultPreview(
    mode: PreviewMode,
  ): void {

    this.defaultPreview.set(
      mode,
    );

  }

  toggleReduceAnimations():
    void {

    this.reduceAnimations.update(
      value => !value,
    );

  }

  togglePageTransitions():
    void {

    this.pageTransitions.update(
      value => !value,
    );

  }

  toggleBrowserNotifications():
    void {

    this.browserNotifications.update(
      value => !value,
    );

  }

  toggleEnquiryAlerts():
    void {

    this.enquiryAlerts.update(
      value => !value,
    );

  }

  toggleCampaignAlerts():
    void {

    this.campaignAlerts.update(
      value => !value,
    );

  }

  toggleExpiryAlerts():
    void {

    this.expiryAlerts.update(
      value => !value,
    );

  }

  toggleAutoSave():
    void {

    this.autoSave.update(
      value => !value,
    );

  }

  toggleShowGrid():
    void {

    this.showGrid.update(
      value => !value,
    );

  }

  toggleSnapElements():
    void {

    this.snapElements.update(
      value => !value,
    );

  }

  toggleConfirmDelete():
    void {

    this.confirmDelete.update(
      value => !value,
    );

  }

  toggleRestoreLastDesign():
    void {

    this.restoreLastDesign.update(
      value => !value,
    );

  }

  toggleHighContrast():
    void {

    this.highContrast.update(
      value => !value,
    );

  }

  toggleLargerText():
    void {

    this.largerText.update(
      value => !value,
    );

  }

  toggleKeyboardShortcuts():
    void {

    this.keyboardShortcuts.update(
      value => !value,
    );

  }

  toggleAnalytics():
    void {

    this.analytics.update(
      value => !value,
    );

  }

  clearCache(): void {

    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // no-op
    }

  }

  resetSettings(): void {

    this.setTheme(
      'system',
    );

    this.density.set(
      'comfortable',
    );

    this.sidebarMode.set(
      'expanded',
    );

    this.defaultPreview.set(
      'desktop',
    );

    this.reduceAnimations.set(
      false,
    );

    this.pageTransitions.set(
      true,
    );

    this.browserNotifications.set(
      true,
    );

    this.enquiryAlerts.set(
      true,
    );

    this.campaignAlerts.set(
      true,
    );

    this.expiryAlerts.set(
      true,
    );

    this.autoSave.set(
      true,
    );

    this.showGrid.set(
      false,
    );

    this.snapElements.set(
      true,
    );

    this.confirmDelete.set(
      true,
    );

    this.restoreLastDesign.set(
      true,
    );

    this.highContrast.set(
      false,
    );

    this.largerText.set(
      false,
    );

    this.keyboardShortcuts.set(
      true,
    );

    this.analytics.set(
      true,
    );

  }

  saveChanges(): void {

    const settings = {
      theme:
        this.theme(),

      density:
        this.density(),

      sidebarMode:
        this.sidebarMode(),

      defaultPreview:
        this.defaultPreview(),

      reduceAnimations:
        this.reduceAnimations(),

      pageTransitions:
        this.pageTransitions(),

      browserNotifications:
        this.browserNotifications(),

      enquiryAlerts:
        this.enquiryAlerts(),

      campaignAlerts:
        this.campaignAlerts(),

      expiryAlerts:
        this.expiryAlerts(),

      autoSave:
        this.autoSave(),

      showGrid:
        this.showGrid(),

      snapElements:
        this.snapElements(),

      confirmDelete:
        this.confirmDelete(),

      restoreLastDesign:
        this.restoreLastDesign(),

      highContrast:
        this.highContrast(),

      largerText:
        this.largerText(),

      keyboardShortcuts:
        this.keyboardShortcuts(),

      analytics:
        this.analytics(),
    };

    localStorage.setItem(
      'braintechno.settings',
      JSON.stringify(
        settings,
      ),
    );

  }

}
