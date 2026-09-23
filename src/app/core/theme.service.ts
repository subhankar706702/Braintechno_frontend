import {
  Injectable,
  effect,
  signal,
} from '@angular/core';

export type ThemeMode =
  | 'light'
  | 'dark'
  | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  private readonly storageKey =
    'brain-techno-theme';

  private readonly systemDarkQuery =
    window.matchMedia(
      '(prefers-color-scheme: dark)',
    );

  readonly theme =
    signal<ThemeMode>(
      this.getStoredTheme(),
    );

  constructor() {
    effect(() => {
      this.applyTheme(
        this.theme(),
      );
    });

    this.systemDarkQuery.addEventListener(
      'change',
      () => {
        if (
          this.theme() === 'system'
        ) {
          this.applyTheme(
            'system',
          );
        }
      },
    );
  }

  setTheme(
    mode: ThemeMode,
  ): void {
    this.theme.set(
      mode,
    );

    localStorage.setItem(
      this.storageKey,
      mode,
    );
  }

  private applyTheme(
    mode: ThemeMode,
  ): void {
    const resolvedTheme:
      'light' | 'dark' =
      mode === 'system'
        ? this.systemDarkQuery.matches
          ? 'dark'
          : 'light'
        : mode;

    document.documentElement.setAttribute(
      'data-theme',
      resolvedTheme,
    );

    document.documentElement.style.colorScheme =
      resolvedTheme;
  }

  private getStoredTheme():
    ThemeMode {
    const stored =
      localStorage.getItem(
        this.storageKey,
      );

    if (
      stored === 'light' ||
      stored === 'dark' ||
      stored === 'system'
    ) {
      return stored;
    }

    return 'system';
  }
}
