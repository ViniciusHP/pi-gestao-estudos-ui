import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { SharedModule } from '../../shared/shared.module';
import { SubjectFormModule } from './subject-form/subject-form.module';
import { SubjectsComponent } from './subjects.component';
import { usersRoutes } from './subjects.routes';

@NgModule({
    declarations: [SubjectsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(usersRoutes),

        ButtonModule,
        TableModule,

        SubjectFormModule,
        SharedModule,
    ],
    exports: [SubjectsComponent],
})
export class SubjectsModule {}
