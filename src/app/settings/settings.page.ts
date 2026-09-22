import { CommonModule } from '@angular/common';
import {
  Component,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type SettingsSection =
  | 'appearance'
  | 'language'
  | 'notifications'
  | 'editor'
  | 'accessibility'
  | 'privacy'
  | 'security'
  | 'system';

type ThemeMode =
  | 'light'
  | 'dark'
  | 'system';

type DensityMode =
  | 'comfortable'
  | 'compact';

type SidebarMode =
  | 'expanded'
  | 'collapsed';

type PreviewMode =
  | 'desktop'
  | 'tablet'
  | 'mobile';

type SettingsMenuItem = {
  id: SettingsSection;
  label: string;
  description: string;
  icon: string;
  tone:
    | 'pink'
    | 'blue'
    | 'green'
    | 'violet'
    | 'orange';
};

@Component({
  selector: 'bt-settings-page',
  standalone: true,

  imports: [
    CommonModule,
    MatIconModule,
  ],

  templateUrl:
    './settings.page.html',

  styleUrl:
    './settings.page.scss',
})
export class SettingsPage {

  readonly activeSection =
    signal<SettingsSection>(
      'appearance',
    );

  readonly theme =
    signal<ThemeMode>(
      'system',
    );

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

  readonly menuItems:
    SettingsMenuItem[] = [

    {
      id: 'appearance',
      label: 'Appearance',
      description:
        'Theme, layout and display',
      icon: 'light_mode',
      tone: 'pink',
    },

    {
      id: 'language',
      label: 'Language & Region',
      description:
        'Language, timezone and format',
      icon: 'language',
      tone: 'blue',
    },

    {
      id: 'notifications',
      label: 'Notifications',
      description:
        'Manage your alerts',
      icon: 'notifications_none',
      tone: 'green',
    },

    {
      id: 'editor',
      label: 'Editor Preferences',
      description:
        'Customize your editor experience',
      icon: 'edit_square',
      tone: 'blue',
    },

    {
      id: 'accessibility',
      label: 'Accessibility',
      description:
        'Make the app work for you',
      icon: 'accessibility_new',
      tone: 'violet',
    },

    {
      id: 'privacy',
      label: 'Privacy & Data',
      description:
        'Control your data and privacy',
      icon: 'shield',
      tone: 'green',
    },

    {
      id: 'security',
      label: 'Security',
      description:
        'Password and active sessions',
      icon: 'lock',
      tone: 'orange',
    },

    {
      id: 'system',
      label: 'System',
      description:
        'App version and maintenance',
      icon: 'info',
      tone: 'blue',
    },

  ];


  setSection(
    section: SettingsSection,
  ): void {

    this.activeSection.set(
      section,
    );

  }


  setTheme(
    theme: ThemeMode,
  ): void {

    this.theme.set(
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
      // UI first. Connect app-specific cache handling later.
    }

  }


  resetSettings(): void {

    this.theme.set(
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
