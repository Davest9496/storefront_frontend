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

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true,
    }),

    provideRouter(routes, withComponentInputBinding()),

    provideClientHydration(withEventReplay()),

    // Enhanced HTTP client with interceptors
    provideHttpClient(withInterceptorsFromDi()),

    ScrollService,
  ],
};
