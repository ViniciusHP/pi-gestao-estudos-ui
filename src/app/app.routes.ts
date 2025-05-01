import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadChildren: () =>
            import('./core/login/login.module').then((m) => m.LoginModule),
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },
];
