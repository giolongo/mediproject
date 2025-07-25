import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadChildren: () =>
            import('../components/home/home.routes').then(m => m.HOME_ROUTES),
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];
