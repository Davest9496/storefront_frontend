import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { routes } from './app.routes';
import { ScrollService } from './services/scroll.service';
import { API_INTERCEPTORS } from './interceptors';
import { AuthInterceptor } from './interceptors/auth.interceptor';

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

    // Register Auth interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },

    ScrollService,
  ],
};
