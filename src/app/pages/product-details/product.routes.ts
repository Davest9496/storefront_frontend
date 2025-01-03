import { Routes } from '@angular/router';
import { ProductDetailsComponent } from './product-details.component';
import { CategoryService } from '@app/services/category.services';

export const PRODUCT_ROUTES: Routes = [
  {
    path: ':id',
    component: ProductDetailsComponent,
    providers: [CategoryService],
  },
];
