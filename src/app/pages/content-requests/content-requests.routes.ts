import { Routes } from '@angular/router';
import { ContentRequestFormComponent } from './content-request-form/content-request-form.component';
import { ContentRequestsComponent } from './content-requests.component';

export const usersRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ContentRequestsComponent,
    },
    {
        path: 'new',
        component: ContentRequestFormComponent,
    },
    {
        path: ':code',
        component: ContentRequestFormComponent,
    },
];
