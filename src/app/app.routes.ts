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
        path: 'subjects',
        loadChildren: () =>
            import('./pages/subjects/subjects.module').then(
                (m) => m.SubjectsModule
            ),
    },
    {
        path: 'content-requests',
        loadChildren: () =>
            import('./pages/content-requests/content-requests.module').then(
                (m) => m.ContentRequestsModule
            ),
    },
    {
        path: 'roadmaps',
        loadChildren: () =>
            import('./pages/roadmaps/roadmaps.module').then(
                (m) => m.RoadmapsModule
            ),
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },
];
