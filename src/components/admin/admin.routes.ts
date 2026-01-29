import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { AdminComponent } from './admin';
import { isLoggedGuard } from '../../app/guards/isLogged.guard';
import { isNotLoggedGuard } from '../../app/guards/isNotLogged.guard';

export const ADMIN_ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [isNotLoggedGuard]
    },
    {
        path: '',
        component: AdminComponent,
        canActivate: [isLoggedGuard]
    }
];
