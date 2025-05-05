import { Routes } from '@angular/router';
import { SubjectFormComponent } from './subject-form/subject-form.component';
import { SubjectsComponent } from './subjects.component';

export const usersRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: SubjectsComponent,
    },
    {
        path: 'new',
        component: SubjectFormComponent,
    },
    {
        path: ':code',
        component: SubjectFormComponent,
    },
];
