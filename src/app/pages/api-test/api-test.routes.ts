import { Routes } from '@angular/router';

export const API_TEST_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./api-test.component').then((m) => m.ApiTestComponent),
  },
];
