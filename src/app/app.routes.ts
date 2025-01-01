// Main routing configuration file

import { Routes } from '@angular/router';
import { ScrollGuard } from './guards/scroll.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/home/home.routes').then((m) => m.HOME_ROUTES),
    canActivate: [ScrollGuard],
  },
  {
    path: 'category',
    loadChildren: () =>
      import('./pages/category/category.routes').then((m) => m.CATEGORY_ROUTES),
    canActivate: [ScrollGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((m) => m.NotFoundComponent),
    canActivate: [ScrollGuard],
  },
];
