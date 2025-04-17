import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { routes } from './app.routes';
import { ScrollService } from './services/scroll.service';
import { API_INTERCEPTORS } from './interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true,
    }),

    provideRouter(routes, withComponentInputBinding()),

    provideClientHydration(withEventReplay()),

    // Enhanced HTTP client with interceptors
    provideHttpClient(withInterceptorsFromDi()),

    // Add your API interceptors if needed
    ...API_INTERCEPTORS,

    ScrollService,
  ],
};
