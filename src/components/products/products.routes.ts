import { Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProductDetailComponent } from '../product-detail/product-detail.component';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: ':id',
    component: ProductDetailComponent
  },
  {
    path: '',
    component: ProductsComponent
  }
];
