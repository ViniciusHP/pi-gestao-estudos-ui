import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadChildren: () =>
            import('./core/login/login.module').then((m) => m.LoginModule),
    },
    {
        path: 'users',
        loadChildren: () =>
            import('./pages/users/users.module').then((m) => m.UsersModule),
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },
];
