import {
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';

import {
  provideRouter,
} from '@angular/router';

import {
  provideHttpClient,
} from '@angular/common/http';

import {
  routes,
} from '../app.routes';

import {
  environment,
} from '../../environments/environment';

export const API_BASE_URL =
  environment.apiBaseUrl;

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true,
    }),

    provideRouter(
      routes,
    ),

    provideHttpClient(),
  ],
};