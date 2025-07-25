import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadChildren: () =>
            import('../components/home/home.routes').then(m => m.HOME_ROUTES),
        pathMatch: 'full'
    },
    {
        path: 'products',
        loadChildren: () =>
            import('../components/products/products.routes').then(m => m.PRODUCTS_ROUTES),
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];
