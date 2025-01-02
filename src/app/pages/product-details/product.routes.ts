import { Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details.component';

export const PRODUCT_ROUTES: Routes = [
  {
    path: ':id',
    component: ProductDetailsComponent,
  },
];
