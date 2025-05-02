import { Routes } from '@angular/router';
import { UserFormComponent } from './user-form/user-form.component';
import { UsersComponent } from './users.component';

export const usersRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: UsersComponent,
    },
    {
        path: 'new',
        component: UserFormComponent,
    },
    {
        path: ':code',
        component: UserFormComponent,
    },
];
