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
            import('../components/products/products.routes').then(m => m.PRODUCTS_ROUTES)
    },    
    {
        path: 'about',
        loadChildren: () =>
            import('../components/who-are/who-are.routes').then(m => m.WHO_ARE_ROUTES)
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];
