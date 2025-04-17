import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';
import { ApiInterceptor } from './api.interceptor';

export const API_INTERCEPTORS: Provider[] = [
  { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
];
